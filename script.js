/* ============================================================
   script.js — FMTech (corregido v2)
   ============================================================ */

/* ── FUNCIONES GLOBALES: el HTML las llama con onclick ─────── */

var activeTabId = "selectronica";

function showTab(tabId) {
    var current = document.getElementById(activeTabId);
    if (current) { current.style.display = 'none'; current.classList.remove('active'); }
    var next = document.getElementById(tabId);
    if (next)    { next.style.display = 'block';  next.classList.add('active'); }
    activeTabId = tabId;
}

function changeImage(tabLinkId) {
    var tabMap = {
        'selectronica-tab':       'selectronica',
        'telecomunicaciones-tab': 'telecomunicaciones',
        'slogica-tab':            'slogica'
    };
    // Desactivar todos los iconos
    document.querySelectorAll('.ul-central a').forEach(function(link) {
        var img = link.querySelector('img');
        if (img) img.src = img.src.replace('-activado.png', '-desactivado.png');
    });
    // Activar el seleccionado
    var selLink = document.getElementById(tabLinkId);
    if (selLink) {
        var img = selLink.querySelector('img');
        if (img) img.src = img.src.replace('-desactivado.png', '-activado.png');
    }
    // Mostrar contenido
    var contentId = tabMap[tabLinkId];
    if (contentId) showTab(contentId);
}


/* ── TODO LO DEMÁS: esperar a que el DOM esté listo ────────── */

document.addEventListener("DOMContentLoaded", function () {

    /* --- Header: transparencia al hacer scroll --- */
    var header = document.getElementById("site-header");
    if (header) {
        window.addEventListener("scroll", function () {
            header.style.backgroundColor = window.scrollY > 100
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0.9)";
        });
    }

    /* --- Animación de entrada del hero (anime.js) --- */
    if (typeof anime !== 'undefined') {
        var textElements = document.querySelectorAll(
            '.FMTechvanguardia h3, .FMTechvanguardia h2, .FMTechvanguardia h1, .text-background'
        );
        anime.timeline({ loop: false }).add({
            targets: textElements, translateY: [22, 0], opacity: [0, 1],
            easing: "easeOutExpo", duration: 2000,
            delay: function(el, i) { return i * 200; }
        });
    }

    /* --- Imágenes flotantes del hero (siempre ocultas) --- */
    var camarasImage     = document.querySelector('.imagenes .camaras');
    var electronicaImage = document.querySelector('.imagenes .electronica');
    var redesImage       = document.querySelector('.imagenes .redes');

    if (camarasImage && electronicaImage && redesImage) {
        camarasImage.style.display     = 'none';
        electronicaImage.style.display = 'none';
        redesImage.style.display       = 'none';

        var images   = document.querySelector('.imagenes');
        if (images) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    images.classList.toggle('is-visible', entry.isIntersecting);
                });
            }, { threshold: 0.5 });
            observer.observe(images);
        }
    }

    /* --- Menú hamburguesa --- */
    var mobileNavToggle = document.getElementById("mobile-nav-toggle");
    var nav             = document.querySelector("nav");

    if (mobileNavToggle && nav) {
        mobileNavToggle.addEventListener("click", function() {
            nav.classList.toggle("show-nav");
        });
        nav.addEventListener("click", function(event) {
            if (window.innerWidth <= 999 && event.target.tagName === "A") {
                nav.classList.remove("show-nav");
                document.querySelectorAll("nav a").forEach(function(l) { l.classList.remove("active"); });
                event.target.classList.add("active");
            }
        });
        document.addEventListener("click", function(event) {
            if (!nav.contains(event.target) && !mobileNavToggle.contains(event.target)) {
                nav.classList.remove("show-nav");
            }
        });
        window.addEventListener("resize", function() {
            if (window.innerWidth > 999) nav.classList.remove("show-nav");
        });
        window.addEventListener("scroll", function() {
            if (window.innerWidth <= 999) {
                nav.style.backgroundColor = window.scrollY > 100
                    ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)";
            }
        });
    }

    /* --- Video popup --- */
    var playButton         = document.getElementById('playButton');
    var playOverlay        = document.getElementById('playOverlay');
    var overlay            = document.getElementById('overlay');
    var videoPopup         = document.getElementById('video-popup');
    var videoFrame         = document.getElementById('video-frame');
    var closePopup         = document.getElementById('close-popup');
    var serviciosContainer = document.getElementById("nuestrosServicios");

    function resizeVideoPopup() {
        if (!videoPopup) return;
        videoPopup.style.maxWidth  = (window.innerWidth  * 0.8) + 'px';
        videoPopup.style.maxHeight = (window.innerHeight * 0.8) + 'px';
    }

    if (playButton) {
        playButton.addEventListener('click', function() {
            playOverlay.style.opacity = '0.5';
            videoFrame.src = 'https://www.youtube.com/embed/oqO4UDrRKKs?autoplay=1';
            overlay.style.display = 'flex';
            resizeVideoPopup();
            setTimeout(function() { videoPopup.style.top = '25%'; }, 50);
            document.body.style.overflow = 'hidden';
            if (serviciosContainer) serviciosContainer.style.display = 'none';
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', function() {
            playOverlay.style.opacity = '1';
            videoFrame.src = '';
            overlay.style.display = 'none';
            videoPopup.style.top  = '-100%';
            document.body.style.overflow = 'auto';
            if (serviciosContainer) serviciosContainer.style.display = 'block';
        });
    }

    window.addEventListener('resize', resizeVideoPopup);

    /* --- Tabs: inicialización --- */
    document.querySelectorAll('.tab-content').forEach(function(el) {
        el.style.display = 'none';
        el.classList.remove('active');
    });
    showTab('selectronica');

    // Activar imagen del primer tab
    var selTab = document.getElementById('selectronica-tab');
    if (selTab) {
        var img = selTab.querySelector('img');
        if (img) img.src = img.src.replace('-desactivado.png', '-activado.png');
    }

    // Listeners en los links (respaldo del onclick del HTML)
    document.querySelectorAll('.ul-central a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id) changeImage(this.id);
        });
    });

    /* --- Modales --- */
    function abrirModal(id) {
        var m = document.getElementById(id);
        if (m) { m.style.display = 'block'; document.body.style.overflow = 'hidden'; }
    }
    function cerrarModal(id) {
        var m = document.getElementById(id);
        if (m) { m.style.display = 'none';  document.body.style.overflow = 'auto'; }
    }
    document.querySelectorAll('.openModal').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal(trigger.getAttribute('data-modal-target'));
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(function(c) {
        c.addEventListener('click', function() { cerrarModal(c.getAttribute('data-modal-close')); });
    });
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.openModal').forEach(function(trigger) {
            var m = document.getElementById(trigger.getAttribute('data-modal-target'));
            if (e.target === m) cerrarModal(m.id);
        });
    });

    /* --- jQuery y Slick: esperar a que estén disponibles --- */
    function initJQuery() {
        if (typeof $ === 'undefined') { setTimeout(initJQuery, 150); return; }

        // Smooth scroll
        $('nav a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            var $target = $(this.hash);
            if ($target.length) {
                $('html, body').stop().animate({ scrollTop: $target.offset().top }, 900);
            }
        });

        // Nav activo al hacer scroll
        $(window).scroll(function() {
            var scrollY = $(window).scrollTop();
            $('section').each(function(i) {
                if ($(this).position().top <= scrollY) {
                    $('nav a.active').removeClass('active');
                    $('nav a').eq(i + 1).addClass('active');
                }
            });
        }).scroll();

        // Carrusel
        initCarousel();
    }

    function initCarousel() {
        if (typeof $.fn.slick === 'undefined') { setTimeout(initCarousel, 150); return; }
        var $c = $('.slick-carousel');
        if (!$c.length) return;
        if ($c.hasClass('slick-initialized')) $c.slick('unslick');
        $c.slick({
            slidesToShow: 2, slidesToScroll: 1,
            infinite: true, arrows: true, dots: false,
            autoplay: true, autoplaySpeed: 2500,
            responsive: [
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 600,  settings: { slidesToShow: 2 } },
                { breakpoint: 480,  settings: { slidesToShow: 1 } }
            ]
        });
    }

    initJQuery();
});