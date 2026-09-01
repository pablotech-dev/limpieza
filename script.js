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

    // Cerrar el menú al hacer clic en un enlace (para móviles)
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            if(hamburger.classList.contains('active')){
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });


    // --- 2. CALCULADORA DE PRECIO INTERACTIVA (reserva.html) ---
    // Solo se ejecutará si estamos en la página que contiene el formulario
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        const habitacionesSelect = document.getElementById('habitaciones');
        const banosSelect = document.getElementById('banos');
        const checkboxes = document.querySelectorAll('.calc-checkbox');
        const priceDisplay = document.getElementById('total-price');

        // Precio base
        const BASE_PRICE = 30;

        // Función para calcular el total
        const calculatePrice = () => {
            let total = BASE_PRICE;

            // Lógica ficticia de coste: +20€ por habitación, +15€ por baño
            const numHabitaciones = parseInt(habitacionesSelect.value);
            const numBanos = parseInt(banosSelect.value);

            total += (numHabitaciones * 20);
            total += (numBanos * 15);

            // Sumar los servicios extras marcados
            checkboxes.forEach(box => {
                if (box.checked) {
                    total += parseInt(box.value);
                }
            });

            // Animación sencilla de conteo para hacer el cambio más fluido
            animateValue(priceDisplay, parseInt(priceDisplay.innerText), total, 300);
        };

        // Escuchar cambios en los selectores y checkboxes
        habitacionesSelect.addEventListener('change', calculatePrice);
        banosSelect.addEventListener('change', calculatePrice);
        checkboxes.forEach(box => box.addEventListener('change', calculatePrice));

        // Inicializar precio al cargar
        calculatePrice();
    }

    // Función auxiliar para animar el cambio numérico
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