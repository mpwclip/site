// Menu mobile et année du pied de page.
(function () {
  var header = document.querySelector('header'), btn = document.querySelector('.menu-btn');
  function set(open) {
    header.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  if (btn) {
    btn.addEventListener('click', function () { set(!header.classList.contains('open')); });
    document.getElementById('menu').addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }
  var y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
})();
