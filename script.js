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

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
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
        const tipoServicioSelect = document.getElementById('tipo-servicio');
        
        // Secciones dinámicas
        const secResidencial = document.getElementById('sec-residencial');
        const secMetros = document.getElementById('sec-metros');
        const secHoras = document.getElementById('sec-horas');

        // Campos Residencial
        const habitacionesSelect = document.getElementById('habitaciones');
        const banosSelect = document.getElementById('banos');
        
        // Campos Metros
        const metrosInput = document.getElementById('metros-cuadrados');
        const frecuenciaSelect = document.getElementById('frecuencia-m2');
        
        // Campos Horas
        const horasInput = document.getElementById('horas-estimadas');

        // Checkboxes y Resumen
        const checkboxes = document.querySelectorAll('.calc-checkbox:not(#legal-check)');
        const legalCheck = document.getElementById('legal-check');
        const priceDisplay = document.getElementById('total-price');
        const sumServicio = document.getElementById('sum-servicio');
        const sumDim = document.getElementById('sum-dim');
        const btnWhatsapp = document.getElementById('btn-whatsapp-reserva');

        // Función para cambiar la sección visible según el servicio
        const updateVisibleSection = () => {
            const servicio = tipoServicioSelect.value;
            secResidencial.classList.add('d-none');
            secMetros.classList.add('d-none');
            secHoras.classList.add('d-none');

            if (servicio === 'residencial') {
                secResidencial.classList.remove('d-none');
            } else if (['oficinas', 'naves', 'comunidades', 'obra'].includes(servicio)) {
                secMetros.classList.remove('d-none');
            } else if (servicio === 'cristales') {
                secHoras.classList.remove('d-none');
            }
            calculatePrice();
        };

        // Función para calcular el total dinámicamente
        const calculatePrice = () => {
            const servicio = tipoServicioSelect.value;
            const servicioTexto = tipoServicioSelect.options[tipoServicioSelect.selectedIndex].text;
            let total = 0;
            let detalleDim = "";

            if (sumServicio) sumServicio.innerText = servicioTexto;

            if (servicio === 'residencial') {
                total = 45;
                const numHabitaciones = parseInt(habitacionesSelect.value);
                const numBanos = parseInt(banosSelect.value);
                total += (numHabitaciones * 25);
                total += (numBanos * 15);
                
                const habTexto = habitacionesSelect.options[habitacionesSelect.selectedIndex].text;
                const banoTexto = banosSelect.options[banosSelect.selectedIndex].text;
                detalleDim = `${habTexto} / ${banoTexto}`;

                document.querySelectorAll('.chk-residencial').forEach(box => {
                    if (box.checked) total += parseInt(box.value);
                });

            } else if (['oficinas', 'naves', 'comunidades', 'obra'].includes(servicio)) {
                const m2 = Math.max(20, parseInt(metrosInput.value) || 0);
                let precioBaseM2 = 2.5;
                if (servicio === 'obra') precioBaseM2 = 4.0;
                if (servicio === 'naves') precioBaseM2 = 2.0;

                total = m2 * precioBaseM2;

                const freq = frecuenciaSelect.value;
                if (freq === 'semanal') total *= 0.85;
                if (freq === 'diario') total *= 0.70;

                detalleDim = `${m2} m² (${frecuenciaSelect.options[frecuenciaSelect.selectedIndex].text})`;

                document.querySelectorAll('.chk-metros').forEach(box => {
                    if (box.checked) total += parseInt(box.value);
                });

            } else if (servicio === 'cristales') {
                const horas = Math.max(2, parseInt(horasInput.value) || 0);
                total = horas * 25;
                detalleDim = `${horas} Horas estimadas`;

                document.querySelectorAll('.chk-horas').forEach(box => {
                    if (box.checked) total += parseInt(box.value);
                });
            }

            total = Math.round(total);
            if (sumDim) sumDim.innerText = detalleDim;
            if (priceDisplay) animateValue(priceDisplay, parseInt(priceDisplay.innerText) || 0, total, 300);

            return total;
        };

        // Escuchar eventos para recalcular
        tipoServicioSelect.addEventListener('change', updateVisibleSection);
        habitacionesSelect.addEventListener('change', calculatePrice);
        banosSelect.addEventListener('change', calculatePrice);
        metrosInput.addEventListener('input', calculatePrice);
        frecuenciaSelect.addEventListener('change', calculatePrice);
        horasInput.addEventListener('input', calculatePrice);
        checkboxes.forEach(box => box.addEventListener('change', calculatePrice));

        // Inicializar al cargar
        updateVisibleSection();

        // Envío de presupuesto por WhatsApp
        if (btnWhatsapp) {
            btnWhatsapp.addEventListener('click', () => {
                if (!nombreInput.value.trim()) {
                    alert("Por favor, introduce tu nombre o el de tu empresa.");
                    nombreInput.focus();
                    return;
                }
                if (legalCheck && !legalCheck.checked) {
                    alert("Debes aceptar la Política de Privacidad para continuar.");
                    return;
                }

                const nombre = nombreInput.value;
                const servicioTexto = tipoServicioSelect.options[tipoServicioSelect.selectedIndex].text;
                const totalEstimado = calculatePrice();
                const detalleDim = sumDim ? sumDim.innerText : "";

                let extrasTexto = "";
                checkboxes.forEach(box => {
                    if (box.checked && box.offsetParent !== null) {
                        extrasTexto += `- ${box.getAttribute('data-name')}\n`;
                    }
                });

                let mensaje = `Hola Pristina, soy ${nombre}.\nMe gustaría solicitar información sobre el servicio: *${servicioTexto}*.\n\n`;
                mensaje += `*Detalles:* ${detalleDim}\n`;
                
                if (extrasTexto) {
                    mensaje += `*Extras solicitados:*\n${extrasTexto}`;
                }

                mensaje += `\n💰 *Presupuesto calculado en la web:* ${totalEstimado}€ (aprox.)\n\n`;
                mensaje += `Quedo a la espera de que me contacten para confirmar disponibilidad. ¡Gracias!`;

                const telefonoEmpresa = "34600000000"; 
                const urlWhatsapp = `https://wa.me/${telefonoEmpresa}?text=${encodeURIComponent(mensaje)}`;
                
                window.open(urlWhatsapp, '_blank');
            });
        }
    }

    // --- Función auxiliar para animación de números ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + '€';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});