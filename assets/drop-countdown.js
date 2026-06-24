/* WHANE — drop countdown
   Reads an ISO datetime from [data-closes-at] on each .js-drop-countdown
   element and renders a zero-padded HH:MM:SS timer, ticking every second.
   Clamps at 00:00:00 and (optionally) swaps in a "closed" label.        */
(function () {
  function pad(n) { return String(n).padStart(2, "0"); }

  function format(totalSeconds) {
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = totalSeconds % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  function init(el) {
    var closesAt = el.getAttribute("data-closes-at");
    var target;

    if (closesAt) {
      target = new Date(closesAt).getTime();
    }

    // Fallback: if no valid close time, count down from a fixed window
    // so the prototype interaction is still visible in the editor.
    if (!target || isNaN(target)) {
      var fallback = parseInt(el.getAttribute("data-fallback-seconds"), 10);
      if (isNaN(fallback)) { fallback = 47 * 3600 + 52 * 60 + 13; }
      target = Date.now() + fallback * 1000;
    }

    var closedLabel = el.getAttribute("data-closed-label") || "00:00:00";

    function tick() {
      var remaining = Math.floor((target - Date.now()) / 1000);
      if (remaining <= 0) {
        el.textContent = closedLabel;
        el.setAttribute("data-state", "closed");
        if (timer) { clearInterval(timer); }
        return;
      }
      el.textContent = format(remaining);
    }

    var timer = setInterval(tick, 1000);
    tick();
  }

  function boot() {
    var nodes = document.querySelectorAll(".js-drop-countdown");
    for (var i = 0; i < nodes.length; i++) { init(nodes[i]); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
