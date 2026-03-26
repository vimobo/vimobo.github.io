// ==================== 1. INTRO VIDEO FADE-OUT ====================
const video = document.getElementById("introVideo");
const intro = document.getElementById("intro");

if (video && intro) {
    video.addEventListener("ended", () => {
        intro.classList.add("fade-out");
        setTimeout(() => {
            intro.style.display = "none";
        }, 500);
    });
}

// ==================== 2. ANIMACIONES AL HACER SCROLL ====================
const animItems = document.querySelectorAll('.fade-in, .fade-in2, .fade-in-shadow');

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animItems.forEach(item => observer.observe(item));

// ==================== 3. NAVEGACIÓN Y SUBMENÚS (MÓVIL) ====================
// Manejo del Menú Hamburguesa
const toggle = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-list");

toggle.addEventListener("click", () => {
    navList.classList.toggle("active");
    toggle.classList.toggle("active");
});

// Lógica de Submenús (Solo para Móvil)
const menuLinks = document.querySelectorAll('#nav-list > li > a');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            const submenu = link.nextElementSibling;
            if (submenu && submenu.tagName === 'UL') {
                e.preventDefault(); // Evita que navegue si hay submenú
                submenu.classList.toggle('open');
            }
        }
    });
});

// Resto de tu código (Video Intro y Carrusel) se mantiene igual...

// ==================== 4. CARRUSEL DE IMÁGENES ====================
const carouselSlide = document.querySelector(".carousel-slide");
const carouselImages = document.querySelectorAll(".carousel-slide img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if (carouselSlide && carouselImages.length > 0) {
    let counter = 0;

    const updateCarousel = () => {
        const size = carouselImages[0].clientWidth; 
        carouselSlide.style.transform = `translateX(${-counter * size}px)`;
    };

    nextBtn.addEventListener("click", () => {
        counter++;
        if (counter >= carouselImages.length) counter = 0;
        updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
        counter--;
        if (counter < 0) counter = carouselImages.length - 1;
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);
}

// ==================== LÓGICA PREGUNTAS FRECUENTES (ACORDEÓN) ====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
        // Saber si el elemento al que dimos clic ya estaba abierto
        const isItemOpen = item.classList.contains('active');
        
        // (Opcional) Cierra todos los demás bloques para que solo haya uno abierto a la vez
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Si no estaba abierto, lo abrimos
        if (!isItemOpen) {
            item.classList.add('active');
        }
    });
});

