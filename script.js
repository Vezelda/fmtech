document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el encabezado
    var header = document.getElementById("site-header");

    // Asigna un listener al evento scroll
    window.addEventListener("scroll", function () {
        // Si la posición de desplazamiento es mayor a 100px, hace el encabezado menos transparente, de lo contrario, restaura el color de fondo más opaco
        header.style.backgroundColor = window.scrollY > 100 ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)";
    });

    // Selecciona los elementos de texto
    var textElements = document.querySelectorAll('.FMTechvanguardia h3, .FMTechvanguardia h2, .FMTechvanguardia h1, .text-background');

    // Configura la animación de entrada con anime.js
    anime.timeline({ loop: false })
        .add({
            targets: textElements,
            translateY: [22, 0],
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 2000,
            delay: function (el, i) {
                return i * 200; // Agrega un pequeño retraso entre cada elemento
            }
        });

    // Selecciona las imágenes
    var camarasImage = document.querySelector('.imagenes .camaras');
    var electronicaImage = document.querySelector('.imagenes .electronica');
    var redesImage = document.querySelector('.imagenes .redes');

    // Ejemplo: Cambia las posiciones de las imágenes
    camarasImage.style.top = '20px';
    camarasImage.style.left = '50px';

    electronicaImage.style.top = '2vh';
    electronicaImage.style.left = '12vh';

    redesImage.style.top = '3vh';
    redesImage.style.left = '9vh';

    var images = document.querySelector('.imagenes');

    // Crea una instancia de Intersection Observer
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Si la imagen está en la vista, agrega la clase de animación
                images.classList.add('images-appear', 'is-visible');
            } else {
                // Si la imagen no está en la vista, quita la clase de animación
                images.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.5 }); // Define el umbral de visibilidad al 50%

    // Observa el contenedor de imágenes
    observer.observe(images);

    // Función para ajustar las posiciones de las imágenes
    var updateImagePositions = function () {
        var windowWidth = window.innerWidth;

        var isMobileResolution = windowWidth <= 4080;

        if (isMobileResolution) {
            // Oculta las imágenes en resoluciones móviles
            camarasImage.style.display = 'none';
            electronicaImage.style.display = 'none';
            redesImage.style.display = 'none';
        } else {
            // Muestra y ajusta las posiciones de las imágenes en resoluciones no móviles
            camarasImage.style.display = 'block';
            electronicaImage.style.display = 'block';
            redesImage.style.display = 'block';

            camarasImage.style.top = '300px';
            camarasImage.style.left = windowWidth * 0.2 + 'px';

            electronicaImage.style.top = '400px';
            electronicaImage.style.left = windowWidth * 0.5 + 'px';

            redesImage.style.top = '60px';
            redesImage.style.left = windowWidth * 0.7 + 'px';
        }
    };

    // Llama a la función inicialmente para establecer las posiciones iniciales
    updateImagePositions();

    // Vuelve a llamar a la función cuando el tamaño de la ventana cambia
    window.addEventListener('resize', updateImagePositions);

    // Selecciona el botón y el menú de navegación
    var mobileNavToggle = document.getElementById("mobile-nav-toggle");
    var nav = document.querySelector("nav");

    // Agrega un listener al botón para alternar la clase 'show-nav'
    mobileNavToggle.addEventListener("click", function () {
        nav.classList.toggle("show-nav");
    });

    // Cierra el menú si se hace clic en un enlace en dispositivos móviles
    nav.addEventListener("click", function (event) {
        if (window.innerWidth <= 767 && event.target.tagName === "A") {
            nav.classList.remove("show-nav");

            // Quita la clase 'active' de todos los enlaces
            document.querySelectorAll("nav a").forEach(function (link) {
                link.classList.remove("active");
            });

            // Agrega la clase 'active' al enlace clicado
            event.target.classList.add("active");
        }
    });

    // Cierra el menú si se hace clic fuera del menú en dispositivos móviles
    document.addEventListener("click", function (event) {
        var isClickInsideNav = nav.contains(event.target);
        var isClickInsideToggle = mobileNavToggle.contains(event.target);

        if (!isClickInsideNav && !isClickInsideToggle) {
            nav.classList.remove("show-nav");
        }
    });

    // Cierra el menú al cambiar el tamaño de la ventana en dispositivos móviles
    window.addEventListener("resize", function () {
        if (window.innerWidth > 767) {
            nav.classList.remove("show-nav");
        }
    });

    // Efecto de transición para el menú en dispositivos móviles
    window.addEventListener("scroll", function () {
        if (window.innerWidth <= 767) {
            // Si la posición de desplazamiento es mayor a 100px, hace el menú menos transparente, de lo contrario, restaura la opacidad
            nav.style.backgroundColor = window.scrollY > 100 ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)";
        }
    });
    var playButton = document.getElementById('playButton');
    var playOverlay = document.getElementById('playOverlay');
    var overlay = document.getElementById('overlay');
    var videoPopup = document.getElementById('video-popup');
    var videoFrame = document.getElementById('video-frame');
    var closePopup = document.getElementById('close-popup');

    playButton.addEventListener('click', function () {
        playOverlay.style.opacity = '0.5'; // Atenuar el color del icono de play
        var videoId = "oqO4UDrRKKs"; // Extraído del enlace del video
        var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';

        videoFrame.src = videoUrl;
        overlay.style.display = 'flex';
        resizeVideoPopup(); // Ajustar el tamaño del pop-up al abrir
    });

    closePopup.addEventListener('click', function () {
        playOverlay.style.opacity = '1'; // Restaurar la opacidad del icono de play
        videoFrame.src = '';
        overlay.style.display = 'none';
    });

    // Ajustar el tamaño del pop-up al cambiar el tamaño de la ventana
    window.addEventListener('resize', function () {
        resizeVideoPopup();
    });

    function resizeVideoPopup() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        // Establecer el tamaño máximo del pop-up en dispositivos no móviles
        var maxWidth = windowWidth * 0.8;
        var maxHeight = windowHeight * 0.8;

        // Aplicar el tamaño máximo
        videoPopup.style.maxWidth = maxWidth + 'px';
        videoPopup.style.maxHeight = maxHeight + 'px';
    }
    playButton.addEventListener('click', function () {
        playOverlay.style.opacity = '0.5';
        var videoId = "oqO4UDrRKKs";
        var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    
        videoFrame.src = videoUrl;
        overlay.style.display = 'flex';
    
        // Iniciar la animación del pop-up
        setTimeout(function () {
            videoPopup.style.top = '25%'; // Mover el pop-up hacia abajo
        }, 50); // Ajustar según sea necesario para dar tiempo a que se aplique el estilo
    
        // Bloquear la interacción con el fondo
        document.body.style.overflow = 'hidden';
    });
    
    closePopup.addEventListener('click', function () {
        playOverlay.style.opacity = '1';
        videoFrame.src = '';
        overlay.style.display = 'none';
    
        // Restaurar la interacción con el fondo
        document.body.style.overflow = 'auto';
        // Reiniciar la posición del pop-up fuera de la pantalla
        videoPopup.style.top = '-100%';
    });
    
    $(document).ready(function () {
        // Función para animar el desplazamiento suave al hacer clic en los enlaces del menú
        $('nav a[href^="#"]').on('click', function (e) {
            e.preventDefault();
    
            var target = this.hash;
            var $target = $(target);
    
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 900, 'swing', function () {
                window.location.hash = target;
            });
        });
    
        // Función para resaltar el enlace activo al hacer scroll
        $(window).scroll(function () {
            var scrollDistance = $(window).scrollTop();
    
            $('section').each(function (i) {
                if ($(this).position().top <= scrollDistance) {
                    $('nav a.active').removeClass('active');
                    $('nav a').eq(i + 1).addClass('active'); // Suma 1 porque el primer enlace es para Inicio
                }
            });
        }).scroll();
    });
        var playButton = document.getElementById('playButton');
        var playOverlay = document.getElementById('playOverlay');
        var overlay = document.getElementById('overlay');
        var videoPopup = document.getElementById('video-popup');
        var videoFrame = document.getElementById('video-frame');
        var closePopup = document.getElementById('close-popup');
        var serviciosContainer = document.getElementById("servicios-container");

        playButton.addEventListener('click', function () {
            playOverlay.style.opacity = '0.5';
            var videoId = "oqO4UDrRKKs";
            var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';

            videoFrame.src = videoUrl;
            overlay.style.display = 'flex';

            // Iniciar la animación del pop-up
            setTimeout(function () {
                videoPopup.style.top = '25%'; // Mover el pop-up hacia abajo
            }, 50); // Ajustar según sea necesario para dar tiempo a que se aplique el estilo

            // Bloquear la interacción con el fondo
            document.body.style.overflow = 'hidden';

            // Oculta el elemento .servicios-container
            serviciosContainer.style.display = 'none';
        });

        closePopup.addEventListener('click', function () {
            playOverlay.style.opacity = '1';
            videoFrame.src = '';
            overlay.style.display = 'none';

            // Restaurar la interacción con el fondo
            document.body.style.overflow = 'auto';
            // Reiniciar la posición del pop-up fuera de la pantalla
            videoPopup.style.top = '-100%';

            // Muestra nuevamente el elemento .servicios-container
            serviciosContainer.style.display = 'block';
        });
    


        
        var activeTabId = "selectronica";

        document.getElementById(activeTabId).style.display = 'block';
        
        function showTab(tabId) {
            // Elimina la clase "active" de todas las pestañas
            tabLinks.forEach(function (tabLink) {
                tabLink.classList.remove('active');
            });
        
            // Agrega la clase "active" a la pestaña seleccionada
            document.getElementById(tabId).classList.add('active');
        
            document.getElementById(activeTabId).style.display = 'none';
            document.getElementById(tabId).style.display = 'block';
            activeTabId = tabId;
        }
        
        var tabLinks = document.querySelectorAll('.ul-central a');
        tabLinks.forEach(function (tabLink) {
            tabLink.addEventListener('click', function (event) {
                event.preventDefault();
                var tabId = this.getAttribute('href').substring(1);
                showTab(tabId);
            });
        });
        
        // Configura el estado inicial activo
    document.getElementById(activeTabId + '-tab').classList.add('active');
    changeImage(activeTabId + '-tab');

    // Función para cambiar la imagen activa
    function changeImage(tabId) {
        // Desactiva la imagen en todas las pestañas
        var allTabs = document.querySelectorAll('.ul-central a');
        allTabs.forEach(function (tab) {
            var imgElement = tab.querySelector('img');
            imgElement.src = imgElement.src.replace('-activado.png', '-desactivado.png');
        });

        // Activa la imagen en la pestaña específica
        var imgElement = document.getElementById(tabId).querySelector('img');
        imgElement.src = imgElement.src.replace('-desactivado.png', '-activado.png');
    }

    // Agrega el evento 'click' a todas las pestañas
    var tabLinks = document.querySelectorAll('.ul-central a');
    tabLinks.forEach(function (tabLink) {
        tabLink.addEventListener('click', function (event) {
            event.preventDefault();
            var tabId = this.getAttribute('href').substring(1);
            showTab(tabId);
            changeImage(tabId + '-tab');
        });
    });

    var modalTriggers = document.querySelectorAll('.openModal');
    var closeTriggers = document.querySelectorAll('[data-modal-close]');

    // Función para abrir el modal
    function abrirModal(targetModalId) {
        var targetModal = document.getElementById(targetModalId);
        targetModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar el desplazamiento del fondo
    }

    // Función para cerrar el modal
    function cerrarModal(targetModalId) {
        var targetModal = document.getElementById(targetModalId);
        targetModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Permitir el desplazamiento del fondo
    }

    modalTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            var targetModalId = trigger.getAttribute('data-modal-target');
            abrirModal(targetModalId);
        });
    });

    closeTriggers.forEach(function(closeTrigger) {
        closeTrigger.addEventListener('click', function() {
            var targetModalId = closeTrigger.getAttribute('data-modal-close');
            cerrarModal(targetModalId);
        });
    });

    window.addEventListener('click', function(event) {
        modalTriggers.forEach(function(trigger) {
            var targetModalId = trigger.getAttribute('data-modal-target');
            var targetModal = document.getElementById(targetModalId);
            if (event.target == targetModal) {
                cerrarModal(targetModalId);
            }
        });
    });
    $('.slick-carousel').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
    });
   // Establece el texto en español para las flechas
        $('.slick-prev').text('Anterior');
        $('.slick-next').text('Siguiente');

});


