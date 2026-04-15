// ==================== 0. INDICADOR DE PÁGINA ACTIVA EN NAV ====================
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Obtener todos los enlaces del nav
    const navLinks = document.querySelectorAll('#nav-list > li > a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Comparar si el href coincide con la página actual
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('nav-active');
        }
    });
});

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

// ==================== LÓGICA TALLERES (ACORDEÓN) ====================
const tallerItems = document.querySelectorAll('.taller-item');

tallerItems.forEach(item => {
    const headerBtn = item.querySelector('.taller-header');
    const previewBtn = item.querySelector('.taller-preview');
    
    const toggleTaller = () => {
        const isItemOpen = item.classList.contains('active');
        
        // Cierra todos los demás talleres para que solo haya uno abierto a la vez
        tallerItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Si no estaba abierto, lo abrimos
        if (!isItemOpen) {
            item.classList.add('active');
        }
    };
    
    headerBtn.addEventListener('click', toggleTaller);
    previewBtn.addEventListener('click', toggleTaller);
    previewBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTaller();
        }
    });
});

// ==================== ANIMACIÓN DE TYPING (ESCRITURA) ====================
function typeWriter(element, speed = 30) {
    const text = element.innerHTML;
    element.innerHTML = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Aplicar typing animation cuando el elemento sea visible
document.addEventListener('DOMContentLoaded', () => {
    const section1H2 = document.querySelector('#section1 h2');
    const section2H2 = document.querySelector('#section2 h2');
    const section2P = document.querySelector('#section2 p');

    if (section1H2) {
        const observerSection1 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    typeWriter(entry.target, 25);
                    observerSection1.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observerSection1.observe(section1H2);
    }

    if (section2H2) {
        const observerSection2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    typeWriter(entry.target, 25);
                    observerSection2.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observerSection2.observe(section2H2);
    }

    if (section2P) {
        const observerSection2P = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    entry.target.classList.add('typed');
                    typeWriter(entry.target, 20);
                    observerSection2P.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observerSection2P.observe(section2P);
    }
});

