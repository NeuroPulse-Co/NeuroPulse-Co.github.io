(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    var btn = dropdown.querySelector(".nav-dropdown-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = !dropdown.classList.contains("open");
      document
        .querySelectorAll(".nav-dropdown.open")
        .forEach(function (d) {
          d.classList.remove("open");
        });
      if (willOpen) dropdown.classList.add("open");
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown.open").forEach(function (d) {
      d.classList.remove("open");
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-dropdown.open").forEach(function (d) {
        d.classList.remove("open");
      });
      if (nav) nav.classList.remove("open");
    }
  });
})();
