const video = document.getElementById("introVideo");
  const intro = document.getElementById("intro");

  // cuando el video termina
  video.addEventListener("ended", () => {
    intro.classList.add("fade-out");

    // eliminar después del fade
    setTimeout(() => {
      intro.style.display = "none";
    }, 500);
  });

const items = document.querySelectorAll('.fade-in, .fade-in2, .fade-in-shadow');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); // activa la animación
      observer.unobserve(entry.target); // opcional: dejar de observar
    }
  });
}, {
  threshold: 1 // cuando el 10% del elemento es visible
});

items.forEach(item => observer.observe(item));

const toggle = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-list");

toggle.addEventListener("click", () => {
  navList.classList.toggle("active");
  toggle.classList.toggle("active"); // anima icono
});

// Opcional: cerrar menú al pulsar un enlace
document.querySelectorAll("#nav-list a").forEach(link => {
  link.addEventListener("click", () => {
    navList.classList.remove("active");
    toggle.classList.remove("active");
  });
});

const carouselSlide = document.querySelector(".carousel-slide");
const carouselImages = document.querySelectorAll(".carousel-slide img");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let counter = 0;
const size = carouselImages[0].clientWidth;

function updateCarousel() {
  carouselSlide.style.transform = `translateX(${-counter * size}px)`;
}

nextBtn.addEventListener("click", () => {
  counter++;
  if(counter >= carouselImages.length) counter = 0;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  counter--;
  if(counter < 0) counter = carouselImages.length - 1;
  updateCarousel();
});

// Ajusta tamaño si cambias el tamaño de la ventana
window.addEventListener("resize", () => {
  updateCarousel();
});