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
      // opcional: observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // se activa cuando el 10% del elemento está visible
});

items.forEach(item => observer.observe(item));