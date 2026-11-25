// Pet-Meds — cookie banner (OMBee studio banner, full-width variant).
// Shown on the home page only, on every visit to the site.
// The choice is kept for the current visit (sessionStorage), so the banner returns on the next visit.
(function () {
  var KEY = 'petmeds-cookie-consent';
  var choice = null;
  try { choice = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { choice = null; }
  if (choice) return;

  // home page only: / or /index.html
  if (!/(^|\/)(index\.html)?$/.test(location.pathname)) return;

  function build() {
    var box = document.createElement('section');
    box.className = 'cookie-banner';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'הודעת עוגיות');
    box.innerHTML =
      '<div class="container cookie-inner">' +
        '<svg class="cookie-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3.5-3A3 3 0 0 1 14 5.5 3 3 0 0 1 12 3z"/><circle cx="8.5" cy="11" r="1"/><circle cx="12" cy="15.5" r="1"/><circle cx="15.5" cy="13" r="1"/><circle cx="9" cy="16" r=".6"/></svg>' +
        '<p>אתר זה משתמש בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלך. לפרטים נוספים ניתן לעיין ב<a href="privacy.html">מדיניות הפרטיות</a>.</p>' +
        '<div class="cookie-actions">' +
          '<button class="btn btn--primary cookie-accept" type="button">מאשר/ת</button>' +
          '<button class="btn btn--light cookie-decline" type="button">ביטול</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);

    var root = document.documentElement;
    function setHeight() { root.style.setProperty('--cookie-h', box.offsetHeight + 'px'); }
    setHeight();
    window.addEventListener('resize', setHeight);
    document.body.classList.add('has-cookie-banner');
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('show'); }); });

    function choose(value) {
      try { sessionStorage.setItem(KEY, JSON.stringify({ choice: value, date: new Date().toISOString() })); } catch (e) {}
      box.classList.remove('show');
      document.body.classList.remove('has-cookie-banner');
      window.removeEventListener('resize', setHeight);
      setTimeout(function () { box.remove(); }, 400);
    }
    box.querySelector('.cookie-accept').addEventListener('click', function () { choose('accepted'); });
    box.querySelector('.cookie-decline').addEventListener('click', function () { choose('declined'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
