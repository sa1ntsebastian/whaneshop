/* WHANE — drop gate (soft, client-side; test phase)
   - Locked Shop screen: live countdown to the drop; auto-reloads at zero so the
     server re-renders the Shop unlocked for everyone.
   - Early-access page: checks the entered code against the configured code(s);
     on match, remembers it (localStorage) and sends the visitor to the Shop.
   - A remembered early-access visitor sees the Shop before the drop (overlay
     removed client-side).

   NOTE: this is intentionally a SOFT gate — the code(s) are present in the page
   source and can be bypassed by technical users. Good enough to build hype /
   reward insiders during testing; not a hard security boundary. */
(function () {
  var KEY = "whane_early_access";

  function isUnlocked() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  /* ---- Locked Shop overlay + countdown ---------------------------------- */
  function initOverlay() {
    var overlay = document.querySelector("[data-drop-overlay]");
    if (!overlay) { return; }

    var section = overlay.closest(".shop-grid");

    // Early-access visitor: reveal the Shop immediately.
    if (isUnlocked()) {
      overlay.parentNode && overlay.parentNode.removeChild(overlay);
      if (section) { section.classList.remove("shop-grid--locked"); }
      return;
    }

    var cd = overlay.querySelector("[data-drop-countdown]");
    if (!cd) { return; }
    var target = Date.parse(cd.getAttribute("data-drop-at"));
    if (isNaN(target)) { return; }

    var elD = cd.querySelector("[data-dd]");
    var elH = cd.querySelector("[data-hh]");
    var elM = cd.querySelector("[data-mm]");
    var elS = cd.querySelector("[data-ss]");
    var reloaded = false;

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        if (!reloaded) { reloaded = true; window.location.reload(); }
        return;
      }
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600);  s -= h * 3600;
      var m = Math.floor(s / 60);    s -= m * 60;
      if (elD) { elD.textContent = pad(d); }
      if (elH) { elH.textContent = pad(h); }
      if (elM) { elM.textContent = pad(m); }
      if (elS) { elS.textContent = pad(s); }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Early-access code form ------------------------------------------- */
  function initForm() {
    var form = document.querySelector("[data-early-form]");
    if (!form) { return; }

    var input = form.querySelector("[data-early-input]");
    var error = form.querySelector("[data-early-error]");
    var shopUrl = form.getAttribute("data-shop-url") || "/";
    var codes = (form.getAttribute("data-codes") || "")
      .split(",")
      .map(function (c) { return c.trim().toLowerCase(); })
      .filter(Boolean);

    // Already unlocked? Offer a straight path in.
    if (isUnlocked() && error) {
      error.textContent = "You already have access.";
      error.classList.add("is-ok");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input && input.value || "").trim().toLowerCase();
      if (val && codes.indexOf(val) !== -1) {
        remember();
        window.location.href = shopUrl;
      } else if (error) {
        error.textContent = "Invalid code.";
        error.classList.remove("is-ok");
        form.classList.add("is-error");
      }
    });
  }

  function boot() { initOverlay(); initForm(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
