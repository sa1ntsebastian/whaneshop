/* WHANE — shop carousel
   Horizontal product carousel with prev/next arrows, native touch swipe
   (CSS scroll-snap), keyboard arrows, and a live "NN / TOTAL" counter.
   No external dependencies.                                              */
(function () {
  function pad(n) { return String(n).padStart(2, "0"); }

  function init(root) {
    var track = root.querySelector(".shop__track");
    if (!track) { return; }

    var slides = track.querySelectorAll(".shop__slide");
    var total = slides.length;
    var prev = root.querySelector(".shop__arrow--prev");
    var next = root.querySelector(".shop__arrow--next");
    var counter = root.querySelector(".shop__counter");

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

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(current() + 1); }
      else if (e.key === "ArrowLeft") { go(current() - 1); }
    });

    window.addEventListener("resize", function () { go(current()); });

    update();
  }

  function boot() {
    var roots = document.querySelectorAll(".shop[data-carousel]");
    for (var i = 0; i < roots.length; i++) { init(roots[i]); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
