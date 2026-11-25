/* ============================================================
   FM Tech — interacciones (sin dependencias externas)
   ============================================================ */

// Pegar acá el enlace "embed" del video para que aparezca el botón de play.
// Ejemplo: 'https://www.youtube.com/embed/ID_DEL_VIDEO?autoplay=1'
const VIDEO_URL = '';

/* --- Header y menú móvil --- */
const header = document.getElementById('site-header');
const nav = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');

function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav a') || !e.target.closest('.header')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
});

/* --- Enlace activo del menú según la sección visible --- */
const links = [...nav.querySelectorAll('a[href^="#"]:not([data-tab])')];
const progress = document.querySelector('.progress');
function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    const line = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    links.forEach((link) => {
        const section = document.querySelector(link.hash);
        if (section && section.offsetTop <= line) current = link;
    });
    // Al llegar al final, marcar la última sección
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = links[links.length - 1];
    }
    links.forEach((link) => link.classList.toggle('active', link === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --- Aparición de bloques al hacer scroll --- */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, i) => {
            entry.target.style.setProperty('--delay', `${i * 0.1}s`);
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.section-head, .split > *, .service, .steps li, .logos li, .contact > *, .tabs')
        .forEach((el) => {
            el.classList.add('reveal');
            // Al terminar se quitan las clases para no interferir con los efectos hover
            el.addEventListener('animationend', (e) => {
                if (e.target === el) el.classList.remove('reveal', 'in');
            });
            observer.observe(el);
        });
}

/* --- Pestañas de soluciones (clic y flechas del teclado) --- */
const tabs = [...document.querySelectorAll('.tab')];
function selectTab(selected) {
    tabs.forEach((tab) => {
        const on = tab === selected;
        tab.setAttribute('aria-selected', on);
        tab.tabIndex = on ? 0 : -1;
        // Sobre la pestaña blanca va el icono celeste; sobre el fondo oscuro, el blanco
        tab.querySelector('img').src = `static/${tab.dataset.icon}-${on ? 'activado' : 'desactivado'}.png`;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !on;
    });
}
tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        const next = tabs[(i + step + tabs.length) % tabs.length];
        selectTab(next);
        next.focus();
    });
});
selectTab(tabs[0]);

// Enlaces que abren una pestaña concreta (p. ej. "Obras civiles" del menú)
document.querySelectorAll('a[data-tab]').forEach((link) => {
    link.addEventListener('click', () => selectTab(document.getElementById(link.dataset.tab)));
});

/* --- Modales --- */
const openModal = (id) => document.getElementById(id).showModal();
document.querySelectorAll('[data-modal]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.modal));
});
document.querySelectorAll('dialog').forEach((dialog) => {
    // Cierra con [data-close] o al hacer clic fuera (Esc ya funciona solo)
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
    });
});

// Anterior / siguiente dentro de la misma categoría
document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
        button.closest('dialog').close();
        openModal(button.dataset.go);
    });
});

// Miniaturas de la galería
document.querySelectorAll('[data-photo]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
        const media = thumb.closest('.modal-media');
        const main = media.querySelector('.modal-img');
        main.src = thumb.dataset.photo;
        main.alt = thumb.dataset.alt;
        media.querySelectorAll('[data-photo]').forEach((t) => t.setAttribute('aria-pressed', t === thumb));
    });
});

// "Pedir presupuesto": lleva al formulario con el mensaje ya empezado
let suggested = '';
document.querySelectorAll('[data-quote]').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        link.closest('dialog').close();
        const field = document.querySelector('#contact textarea');
        // No pisa lo que la persona ya haya escrito
        if (!field.value || field.value === suggested) {
            suggested = `Hola, quisiera un presupuesto sobre ${link.dataset.quote}.`;
            field.value = suggested;
        }
        document.getElementById('contactos').scrollIntoView();
    });
});

/* --- Video --- */
const play = document.getElementById('play');
const videoDialog = document.getElementById('video-dialog');
const videoFrame = document.getElementById('video-frame');
if (VIDEO_URL) {
    play.hidden = false;
    play.addEventListener('click', () => {
        videoFrame.src = VIDEO_URL;
        videoDialog.showModal();
    });
    videoDialog.addEventListener('close', () => videoFrame.removeAttribute('src'));
}

/* --- Formulario de contacto (Formspree) --- */
const form = document.getElementById('contact');
const message = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Enviando...';
    message.hidden = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(response.status);
        message.className = 'full form-message ok';
        message.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
        form.reset();
    } catch (error) {
        message.className = 'full form-message error';
        message.textContent = 'Hubo un error al enviar el mensaje. Intentá de nuevo.';
    }

    message.hidden = false;
    button.disabled = false;
    button.textContent = 'Enviar mensaje';
});
