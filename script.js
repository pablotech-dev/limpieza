document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ HAMBURGUESA (Responsive) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            if(hamburger && hamburger.classList.contains('active')){
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- 2. GESTIÓN DE COOKIES LEGALES ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Comprueba si el usuario ya aceptó las cookies antes
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        // Un pequeño timeout para que el banner entre con animación
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 3. CALCULADORA INTERACTIVA Y ENVÍO POR WHATSAPP (reserva.html) ---
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        const nombreInput = document.getElementById('cliente-nombre');
        const habitacionesSelect = document.getElementById('habitaciones');
        const banosSelect = document.getElementById('banos');
        const checkboxes = document.querySelectorAll('.calc-checkbox:not(#legal-check)');
        const legalCheck = document.getElementById('legal-check');
        const priceDisplay = document.getElementById('total-price');
        const btnWhatsapp = document.getElementById('btn-whatsapp-reserva');

        const BASE_PRICE = 45; // Precio base realista (desplazamiento, productos)

        // Función para calcular el total
        const calculatePrice = () => {
            let total = BASE_PRICE;

            const numHabitaciones = parseInt(habitacionesSelect.value);
            const numBanos = parseInt(banosSelect.value);

            // Escala de precios realista
            total += (numHabitaciones * 25);
            total += (numBanos * 15);

            checkboxes.forEach(box => {
                if (box.checked) {
                    total += parseInt(box.value);
                }
            });

            animateValue(priceDisplay, parseInt(priceDisplay.innerText) || BASE_PRICE, total, 300);
            return total;
        };

        // Escuchar cambios para recalcular precio al instante
        habitacionesSelect.addEventListener('change', calculatePrice);
        banosSelect.addEventListener('change', calculatePrice);
        checkboxes.forEach(box => box.addEventListener('change', calculatePrice));

        // Inicializar precio al cargar
        calculatePrice();

        // Gestionar el envío por WhatsApp
        btnWhatsapp.addEventListener('click', () => {
            // Validaciones básicas
            if (!nombreInput.value.trim()) {
                alert("Por favor, introduce tu nombre.");
                nombreInput.focus();
                return;
            }
            if (!legalCheck.checked) {
                alert("Debes aceptar la Política de Privacidad para continuar.");
                return;
            }

            // Recopilar datos
            const nombre = nombreInput.value;
            const habsTexto = habitacionesSelect.options[habitacionesSelect.selectedIndex].text;
            const banosTexto = banosSelect.options[banosSelect.selectedIndex].text;
            const totalEstimado = calculatePrice();

            let extrasTexto = "";
            checkboxes.forEach(box => {
                if (box.checked) {
                    extrasTexto += `- ${box.getAttribute('data-name')}\n`;
                }
            });

            // Construir mensaje de WhatsApp
            let mensaje = `Hola Pristina, soy ${nombre}. Me gustaría solicitar un servicio de limpieza residencial.\n\n`;
            mensaje += `*Detalles de mi vivienda:*\n`;
            mensaje += `🏠 ${habsTexto}\n`;
            mensaje += `🛁 ${banosTexto}\n`;
            
            if (extrasTexto) {
                mensaje += `\n*Extras solicitados:*\n${extrasTexto}`;
            }

            mensaje += `\n💰 *Presupuesto calculado en la web:* ${totalEstimado}€ (aprox.)\n\n`;
            mensaje += `Quedo a la espera de que me contacten para confirmar disponibilidad. ¡Gracias!`;

            // Codificar URL y abrir WhatsApp (cambia el teléfono aquí por el tuyo)
            const telefonoEmpresa = "34600000000"; 
            const urlWhatsapp = `https://wa.me/${telefonoEmpresa}?text=${encodeURIComponent(mensaje)}`;
            
            window.open(urlWhatsapp, '_blank');
        });
    }

    // --- Función auxiliar para animación de números ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});