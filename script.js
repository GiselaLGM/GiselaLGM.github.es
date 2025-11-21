document.addEventListener('DOMContentLoaded', () => {

    // ==== NAVEGACIÓN MÓVIL (HAMBURGUESA) ====
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active'); // Activa/desactiva el menú móvil
            hamburger.classList.toggle('active'); // Cambia el icono de hamburguesa a cruz
        });

        // Cierra el menú móvil al hacer clic en un enlace
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // ==== EFECTO SCROLL REVEAL (REVELAR ELEMENTOS AL HACER SCROLL) ====
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null, // viewport como root
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento visible para activar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Añade la clase 'active' para animar
                observer.unobserve(entry.target); // Deja de observar una vez que se activa
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element); // Empieza a observar cada elemento con la clase 'reveal'
    });

    // ==== EFECTO SCROLL SUAVE PARA ANCLAS ====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});