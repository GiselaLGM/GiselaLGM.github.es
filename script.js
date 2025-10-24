// script.js
// Maneja el toggle del menú móvil, actualiza el año y controla los acordeones del menú
document.addEventListener('DOMContentLoaded', function () {
    // Toggle del menú en pantallas pequeñas (mismo comportamiento que antes)
    var btn = document.querySelector('.menu-toggle');
    var list = document.querySelector('.menu-list');
    if (btn && list) {
        btn.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            list.classList.toggle('open');
            if (list.classList.contains('open')) {
                // focus al primer elemento del menú para accesibilidad
                var first = list.querySelector('li');
                if (first) {
                    first.setAttribute('tabindex', '-1');
                    first.focus();
                }
            }
        });

        // cerrar con ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                if (list.classList.contains('open')) {
                    list.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                    btn.focus();
                }
            }
        });
    }

    // Actualizar año del footer
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Lógica de acordeones para cada sección del menú
    var accordions = Array.prototype.slice.call(document.querySelectorAll('.accordion'));
    var panels = accordions.map(function (a) { return document.getElementById(a.getAttribute('aria-controls')); }).filter(Boolean);

    // Ensure panels are visible on wide screens and collapsed on small by default
    var mq = window.matchMedia('(min-width:900px)');
    var setDesktopMode = function (isDesktop) {
        panels.forEach(function (panel) {
            if (isDesktop) {
                panel.hidden = false;
            } else {
                panel.hidden = true;
                panel.style.maxHeight = '';
                panel.style.opacity = '';
            }
        });
        accordions.forEach(function (a) {
            a.setAttribute('aria-expanded', String(isDesktop));
        });
    };
    // initial
    setDesktopMode(mq.matches);
    // update on resize (debounced)
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { setDesktopMode(mq.matches); }, 150);
    });

    // Helper: collapse panel (with transition)
    function collapsePanel(panel) {
        if (!panel || panel.hidden) return;
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(function () {
            panel.style.maxHeight = '0';
            panel.style.opacity = '0';
        });
        var onEnd = function () {
            panel.hidden = true;
            panel.style.maxHeight = '';
            panel.style.opacity = '';
            panel.removeEventListener('transitionend', onEnd);
        };
        panel.addEventListener('transitionend', onEnd);
    }

    // Helper: open panel
    function openPanel(panel) {
        if (!panel || !panel.hidden) return;
        panel.hidden = false;
        panel.style.opacity = '0';
        panel.style.maxHeight = '0';
        requestAnimationFrame(function () {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.opacity = '1';
        });
        var clean = function () {
            panel.style.maxHeight = '';
            panel.removeEventListener('transitionend', clean);
        };
        panel.addEventListener('transitionend', clean);
    }

    // Attach handlers
    accordions.forEach(function (accordion) {
        var panelId = accordion.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (!panel) return;

        accordion.addEventListener('click', function () {
            // if desktop mode, do nothing (panels are visible)
            if (mq.matches) return;

            var expanded = accordion.getAttribute('aria-expanded') === 'true';

            if (expanded) {
                // collapse this
                accordion.setAttribute('aria-expanded', 'false');
                collapsePanel(panel);
            } else {
                // close others (exclusive behavior)
                accordions.forEach(function (other) {
                    if (other === accordion) return;
                    var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
                    if (other.getAttribute('aria-expanded') === 'true') {
                        other.setAttribute('aria-expanded', 'false');
                        collapsePanel(otherPanel);
                    }
                });

                // open this
                accordion.setAttribute('aria-expanded', 'true');
                openPanel(panel);
            }
        });
    });
});
