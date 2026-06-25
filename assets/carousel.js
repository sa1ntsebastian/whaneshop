/* WHANE — carousel
   Generic full-screen carousel: prev/next arrows, native touch swipe
   (CSS scroll-snap), keyboard arrows, and a live "NN / TOTAL" counter.
   Drives both the shop and the lookbook. No external dependencies.

   Markup hooks (per [data-carousel] root):
     [data-carousel-track]   horizontal scroll container
     [data-carousel-slide]   one slide (children of the track)
     [data-carousel-prev]    previous button
     [data-carousel-next]    next button
     [data-carousel-counter] live "NN / TOTAL" label                       */
(function () {
  function pad(n) { return String(n).padStart(2, "0"); }

  function init(root) {
    var track = root.querySelector("[data-carousel-track]");
    if (!track) { return; }

    var total = track.querySelectorAll("[data-carousel-slide]").length;
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var counter = root.querySelector("[data-carousel-counter]");

    if (total <= 1) {
      if (prev) { prev.style.display = "none"; }
      if (next) { next.style.display = "none"; }
    }

    function current() {
      var w = track.clientWidth || 1;
      return Math.round(track.scrollLeft / w);
    }

    function go(index) {
      var i = Math.max(0, Math.min(total - 1, index));
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    }

    function update() {
      var i = current();
      if (counter) { counter.textContent = pad(i + 1) + " / " + pad(total); }
      if (prev) { prev.disabled = i <= 0; }
      if (next) { next.disabled = i >= total - 1; }
    }

    if (prev) { prev.addEventListener("click", function () { go(current() - 1); }); }
    if (next) { next.addEventListener("click", function () { go(current() + 1); }); }

    var raf;
    track.addEventListener("scroll", function () {
      if (raf) { cancelAnimationFrame(raf); }
      raf = requestAnimationFrame(update);
    });

    // Arrow keys move the carousel the pointer is hovering, else the first one.
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(current() + 1); }
      else if (e.key === "ArrowLeft") { go(current() - 1); }
    });

    window.addEventListener("resize", function () { go(current()); });

    update();
  }

  function boot() {
    var roots = document.querySelectorAll("[data-carousel]");
    for (var i = 0; i < roots.length; i++) { init(roots[i]); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
