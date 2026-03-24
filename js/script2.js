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

const items = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); // activa la animación
      observer.unobserve(entry.target); // opcional: dejar de observar
    }
  });
}, {
  threshold: 0.1 // cuando el 10% del elemento es visible
});

items.forEach(item => observer.observe(item));