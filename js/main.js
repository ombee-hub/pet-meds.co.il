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

  // Accessibility widget
  var STORE_KEY = "pm-a11y-v2";
  var a11yToggle = document.querySelector(".a11y-toggle");
  var panel = document.getElementById("a11y-panel");
  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { state = {}; }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function applyFeature(key, step) {
    // remove every level of this feature, then add the active one
    Array.prototype.slice.call(root.classList).forEach(function (c) {
      if (c.indexOf("a11y-" + key + "-") === 0) root.classList.remove(c);
    });
    if (step > 0) root.classList.add("a11y-" + key + "-" + step);
  }
  function renderTile(tile) {
    var key = tile.getAttribute("data-a11y");
    var labels = tile.getAttribute("data-labels").split("|");
    var step = state[key] || 0;
    tile.setAttribute("aria-pressed", String(step > 0));
    tile.querySelector(".a11y-tile__label").textContent = step > 0 ? labels[step - 1] : tile.getAttribute("data-title");
    tile.querySelectorAll(".a11y-tile__steps i").forEach(function (dot, i) {
      dot.classList.toggle("is-on", i < step);
    });
  }

  Object.keys(state).forEach(function (key) { applyFeature(key, state[key]); });

  if (a11yToggle && panel) {
    var tiles = panel.querySelectorAll(".a11y-tile");
    tiles.forEach(renderTile);

    function openPanel() {
      panel.hidden = false;
      a11yToggle.setAttribute("aria-expanded", "true");
      panel.querySelector(".a11y-panel__close").focus();
    }
    function closePanel() {
      panel.hidden = true;
      a11yToggle.setAttribute("aria-expanded", "false");
      a11yToggle.focus();
    }
    a11yToggle.addEventListener("click", function () {
      if (panel.hidden) openPanel(); else closePanel();
    });
    panel.querySelector(".a11y-panel__close").addEventListener("click", closePanel);
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !a11yToggle.contains(e.target)) closePanel();
    });

    tiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        var key = tile.getAttribute("data-a11y");
        var steps = tile.getAttribute("data-labels").split("|").length;
        state[key] = ((state[key] || 0) + 1) % (steps + 1);
        if (!state[key]) delete state[key];
        applyFeature(key, state[key] || 0);
        renderTile(tile);
        save();
      });
    });

    panel.querySelector("[data-a11y-reset]").addEventListener("click", function () {
      Object.keys(state).forEach(function (key) { applyFeature(key, 0); });
      state = {};
      tiles.forEach(renderTile);
      save();
    });
  }

  // "Descriptions": show alt text / labels in a tooltip on hover and focus
  var tip = document.querySelector(".a11y-tooltip");
  function describe(el) {
    var t = el.closest("img[alt]:not([alt='']), [aria-label], [title]");
    if (!t || (panel && panel.contains(t))) return "";
    return t.getAttribute("alt") || t.getAttribute("aria-label") || t.getAttribute("title") || "";
  }
  function showTip(text, x, y) {
    tip.textContent = text;
    tip.hidden = false;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, x - w / 2)) + "px";
    tip.style.top = (y - h - 14 < 8 ? y + 22 : y - h - 14) + "px";
  }
  if (tip) {
    document.addEventListener("mouseover", function (e) {
      if (!root.classList.contains("a11y-tooltips-1")) return;
      var text = describe(e.target);
      if (text) showTip(text, e.clientX, e.clientY); else tip.hidden = true;
    });
    document.addEventListener("mousemove", function (e) {
      if (!tip.hidden) showTip(tip.textContent, e.clientX, e.clientY);
    });
    document.addEventListener("focusin", function (e) {
      if (!root.classList.contains("a11y-tooltips-1")) return;
      var text = describe(e.target);
      if (!text) { tip.hidden = true; return; }
      var r = e.target.getBoundingClientRect();
      showTip(text, r.left + r.width / 2, r.top);
    });
    document.addEventListener("scroll", function () { tip.hidden = true; }, { passive: true });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
