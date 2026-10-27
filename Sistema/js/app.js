'use strict';

console.log('[Yamila Potel] app.js cargado correctamente.');

document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('site-header');
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  var closeBtn = document.getElementById('nav-close');

  if (!header || !toggle || !nav) {
    return;
  }

  var DESKTOP_BREAKPOINT = 768;

  function isDesktop() {
    return window.matchMedia('(min-width: ' + (DESKTOP_BREAKPOINT + 1) + 'px)').matches;
  }

  function openMenu() {
    header.classList.add('is-open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeMenu() {
    header.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
  }

  function isOpen() {
    return header.classList.contains('is-open');
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeMenu();
      toggle.focus();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      closeMenu();
      toggle.focus();
    });
  }

  nav.addEventListener('click', function (event) {
    var target = event.target;
    if (target && target.closest && target.closest('a') && isOpen()) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (isDesktop() && isOpen()) {
      closeMenu();
    }
  });
});
