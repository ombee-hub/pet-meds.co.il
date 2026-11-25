(function () {
  "use strict";

  var root = document.documentElement;

  // Sticky header shadow
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Side drawer (mobile navigation)
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("drawer");
  var overlay = document.querySelector(".drawer-overlay");
  var drawerClose = drawer && drawer.querySelector(".drawer__close");

  function openDrawer() {
    drawer.hidden = false;
    overlay.hidden = false;
    void drawer.offsetWidth; // let the browser paint the closed state so the slide animates
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    root.classList.add("drawer-open");
    toggle.setAttribute("aria-expanded", "true");
    drawerClose.focus();
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    root.classList.remove("drawer-open");
    toggle.setAttribute("aria-expanded", "false");
    setTimeout(function () {
      if (!drawer.classList.contains("is-open")) {
        drawer.hidden = true;
        overlay.hidden = true;
      }
    }, 350);
    toggle.focus();
  }
  if (toggle && drawer && overlay) {
    toggle.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    drawer.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
      if (e.key !== "Tab") return;
      // keep focus inside the drawer while it is open
      var f = drawer.querySelectorAll("a, button");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && drawer.classList.contains("is-open")) closeDrawer();
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // FAQ category filter
  var catButtons = document.querySelectorAll(".faq-cats button");
  catButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-cat");
      catButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll(".faq details").forEach(function (d) {
        d.hidden = cat !== "all" && d.getAttribute("data-cat") !== cat;
      });
    });
  });

  // Contact form → opens the visitor's mail client with the message prefilled
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = (data.get("subject") || "פנייה מהאתר") + " — " + data.get("name");
      var body =
        "שם: " + data.get("name") + "\n" +
        "טלפון: " + (data.get("phone") || "") + "\n" +
        "שם חיית המחמד: " + (data.get("pet") || "") + "\n\n" +
        data.get("message");
      window.location.href = "mailto:sharon@pet-meds.co.il?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var status = form.querySelector(".form__status");
      if (status) status.classList.add("is-visible");
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
