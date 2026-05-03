// ==================== 0. INDICADOR DE PÁGINA ACTIVA EN NAV ====================
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Obtener todos los enlaces del nav
    const navLinks = document.querySelectorAll('#nav-list > li > a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (link.nextElementSibling && link.nextElementSibling.tagName === 'UL') {
            link.parentElement.classList.add('has-submenu');
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
        }
        
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

// ==================== MÚSICA DE FONDO (INDEX) ====================
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

// ==================== BOCADILLO DE BIENVENIDA (INDEX) ====================
const ambientPopup = document.getElementById("ambientPopup");

// Mostrar el bocadillo solo en la página de index, después del video intro
if (ambientPopup && (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/'))) {
    // Mostrar bocadillo cuando termina el video intro
    if (video && intro) {
        video.addEventListener("ended", () => {
            if (!localStorage.getItem('ambientPopupDismissed')) {
                ambientPopup.style.display = 'block';
            }
        });
    } else {
        // Fallback: mostrar después de 3 segundos si no hay video
        setTimeout(() => {
            if (!localStorage.getItem('ambientPopupDismissed')) {
                ambientPopup.style.display = 'block';
            }
        }, 3000);
    }
    
    // Cerrar bocadillo cuando se hace click en el botón de música
    if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        ambientPopup.classList.add('hidden');
        localStorage.setItem('ambientPopupDismissed', 'true');
    });
}
} else if (ambientPopup) {
    // Ocultar bocadillo si no está en index
    ambientPopup.style.display = 'none';
}

if (backgroundMusic && musicToggle) {
    backgroundMusic.volume = 0.35;

    const setMusicState = (isPlaying) => {
        musicToggle.textContent = isPlaying ? "Pausar ambiente" : "Activar ambiente";
        musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
        musicToggle.classList.toggle("playing", isPlaying);
    };

    const playMusic = () => {
        const playRequest = backgroundMusic.play();

        if (playRequest && typeof playRequest.then === "function") {
            playRequest
                .then(() => setMusicState(true))
                .catch(() => setMusicState(false));
        } else {
            setMusicState(true);
        }
    };

    playMusic();

    musicToggle.addEventListener("click", () => {
    // 1. Cerrar popup SI existe
    if (ambientPopup && !localStorage.getItem('ambientPopupDismissed')) {
        ambientPopup.classList.add('hidden');
        localStorage.setItem('ambientPopupDismissed', 'true');
    }

    // 2. Controlar música
    if (backgroundMusic.paused) {
        playMusic();
    } else {
        backgroundMusic.pause();
        setMusicState(false);
    }
});
}

// ==================== 2. ANIMACIONES AL HACER SCROLL ====================
// ==================== 2. ANIMACIONES AL HACER SCROLL ====================
document.addEventListener('DOMContentLoaded', () => {
    const animItems = document.querySelectorAll(
        '.fade-up, .fade-left, .fade-in'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animItems.forEach(item => observer.observe(item));
    } else {
        animItems.forEach(item => item.classList.add('visible'));
    }
});

// ==================== 3. NAVEGACIÓN Y SUBMENÚS (MÓVIL) ====================
// Manejo del Menú Hamburguesa
const toggle = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-list");

if (toggle && navList) {
    toggle.addEventListener("click", () => {
        navList.classList.toggle("active");
        toggle.classList.toggle("active");
    });
}

// Lógica de Submenús (Solo para Móvil)
const menuLinks = document.querySelectorAll('#nav-list > li > a');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const submenu = link.nextElementSibling;

        if (submenu && submenu.tagName === 'UL') {
            e.preventDefault(); // Evita que navegue si hay submenú

            if (window.innerWidth <= 900) {
                submenu.classList.toggle('open');
                link.setAttribute('aria-expanded', submenu.classList.contains('open') ? 'true' : 'false');
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

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            counter++;
            if (counter >= carouselImages.length) counter = 0;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            counter--;
            if (counter < 0) counter = carouselImages.length - 1;
            updateCarousel();
        });
    }

    window.addEventListener("resize", updateCarousel);
}

// ==================== LÓGICA PREGUNTAS FRECUENTES (ACORDEÓN) ====================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    
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
    if (!headerBtn || !previewBtn) return;
    
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

// ==================== ANIMACIÓN PALABRA A PALABRA ====================

function initWordReveal(el, staggerMs = 55) {
    if (!el) return;

    const words = el.textContent.trim().split(/\s+/);

    el.innerHTML = words
        .map((word, i) =>
            `<span class="word-anim" style="transition-delay:${i * staggerMs}ms">${word}</span>`
        )
        .join(' ');

    const trigger = () =>
        el.querySelectorAll('.word-anim').forEach(s => s.classList.add('in'));

    if (!('IntersectionObserver' in window)) {
        trigger();
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trigger();
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(el);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#section1 h2').forEach(h2 => initWordReveal(h2));
});

function encodeFormData(data) {
    if ('URLSearchParams' in window) {
        return new URLSearchParams(data).toString();
    }

    return Object.keys(data).map(key => (
        encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    )).join('&');
}

// Aplicar typing animation cuando el elemento sea visible
document.addEventListener('DOMContentLoaded', () => {
    const section1H2 = document.querySelector('#section1 h2');
    const section2H2 = document.querySelector('#section2 h2');
    const section2P = document.querySelector('#section2 p');

    observeOrRun(section1H2, (element) => {
        element.classList.add('typed');
        typeWriter(element, 25);
    });

    observeOrRun(section2H2, (element) => {
        element.classList.add('typed');
        typeWriter(element, 25);
    });

    observeOrRun(section2P, (element) => {
        element.classList.add('typed');
        typeWriter(element, 20);
    });
});

// ==================== 5. FORMULARIO "CÓMO SER PARTE" - INTEGRACIÓN CON GOOGLE SHEETS ====================
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-landlight');
    
    if (formulario) {
        // Función de validación mejorada
        const validarFormulario = () => {
            let esValido = true;
            
            // Limpiar errores previos
            document.querySelectorAll('.error-campo').forEach(el => el.remove());
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
            
            // Validar nombre
            const nombre = document.getElementById('nombre');
            if (!nombre.value.trim()) {
                mostrarError(nombre, 'El nombre es requerido');
                esValido = false;
            }
            
            // Validar email
            const email = document.getElementById('email');
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                mostrarError(email, 'El email es requerido');
                esValido = false;
            } else if (!regexEmail.test(email.value)) {
                mostrarError(email, 'Ingresa un email válido');
                esValido = false;
            }
            
            // Validar teléfono (permite: números, espacios, guiones, paréntesis, +)
            const telefono = document.getElementById('telefono');
            const telefonoValor = telefono.value.trim();
            const regexTelefono = /^[\d\s\-\+\(\)]{7,}$/;
            
            if (telefonoValor) {
                // Si hay valor, debe tener formato válido
                if (!regexTelefono.test(telefonoValor)) {
                    mostrarError(telefono, 'Ingresa un teléfono válido (mínimo 7 dígitos)');
                    esValido = false;
                }
                // Validar que tenga al menos 7 dígitos
                const soloDigitos = telefonoValor.replace(/\D/g, '');
                if (soloDigitos.length < 7) {
                    mostrarError(telefono, 'El teléfono debe tener al menos 7 dígitos');
                    esValido = false;
                }
            }
            
            // Validar selects (opciones requeridas)
            const tipoParticipacion = document.getElementById('tipo-participacion');
            if (!tipoParticipacion.value) {
                mostrarError(tipoParticipacion, 'Selecciona una opción de participación');
                esValido = false;
            }
            
            const disponibilidad = document.getElementById('disponibilidad');
            if (!disponibilidad.value) {
                mostrarError(disponibilidad, 'Selecciona tu disponibilidad');
                esValido = false;
            }
            
            const especialidad = document.getElementById('especialidad');
            if (!especialidad.value) {
                mostrarError(especialidad, 'Selecciona tu área de expertise');
                esValido = false;
            }
            
            // Validar experiencia (textarea requerida)
            const experiencia = document.getElementById('experiencia');
            if (!experiencia.value.trim()) {
                mostrarError(experiencia, 'Cuéntanos qué te atrae de LandLight');
                esValido = false;
            }
            
            return esValido;
        };
        
        // Función para mostrar errores
        const mostrarError = (elemento, mensaje) => {
            const formGroup = elemento.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('has-error');
                const errorDiv = document.createElement('span');
                errorDiv.className = 'error-campo';
                errorDiv.textContent = mensaje;
                errorDiv.style.cssText = `
                    display: block;
                    color: #ff6b6b;
                    font-size: 12px;
                    margin-top: 5px;
                    font-weight: 500;
                `;
                elemento.parentNode.insertBefore(errorDiv, elemento.nextSibling);
            }
        };
        
        // Agregar estilos CSS dinámicos
        const style = document.createElement('style');
        style.textContent = `
            .form-group.has-error input,
            .form-group.has-error select,
            .form-group.has-error textarea {
                border-color: #ff6b6b !important;
                background-color: #fff5f5;
            }
        `;
        document.head.appendChild(style);
        
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar antes de enviar
            if (!validarFormulario()) {
                return;
            }
            
            // URL del App Script de Google
            const apiUrl = 'https://script.google.com/macros/s/AKfycbwZFGPQkZuTU-IuiQ_HUqc6_NXpJFJabcTCMAyr-nuFnGSR-_-MkyjFJf9uX_0q1R4YsQ/exec';
            
            // Recopilar datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                tipo_participacion: document.getElementById('tipo-participacion').value,
                experiencia: document.getElementById('experiencia').value.trim(),
                especialidad: document.getElementById('especialidad').value,
                disponibilidad: document.getElementById('disponibilidad').value,
                redes_sociales: document.getElementById('redes').value.trim(),
                mensaje: document.getElementById('mensaje').value.trim(),
                tipo_formulario: 'inscripcion',
                timestamp: new Date().toLocaleString('es-ES')
            };
            
            try {
                // Mostrar indicador de envío
                const submitBtn = formulario.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Enviar datos al API
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: encodeFormData(formData)
                });
                
                // Mostrar mensaje de éxito
                formulario.innerHTML = `
                    <div class="success-message fade-in" style="text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                        <h3 style="margin: 0 0 15px 0; font-size: 24px;">¡Gracias por tu interés!</h3>
                        <p style="margin: 0 0 10px 0; font-size: 16px;">Hemos recibido tu solicitud correctamente.</p>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Nos pondremos en contacto contigo pronto para conocer más sobre tu participación en LandLight.</p>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                
                // Mostrar mensaje de error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.cssText = `
                    background-color: #ff6b6b;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    text-align: center;
                `;
                errorDiv.textContent = 'Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.';
                formulario.appendChild(errorDiv);
                
                // Restaurar botón
                const submitBtn = formulario.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Enviar Mi Solicitud';
                submitBtn.disabled = false;
            }
        });
    }
});

// ==================== 6. FORMULARIO "TRANSPARENCIA" - INTEGRACIÓN CON GOOGLE SHEETS ====================
document.addEventListener('DOMContentLoaded', () => {
    const formularioTransparencia = document.querySelector('.transparency-form');
    
    if (formularioTransparencia) {
        // Función de validación mejorada
        const validarFormularioTransparencia = () => {
            let esValido = true;
            
            // Limpiar errores previos
            document.querySelectorAll('.transparency-form .error-campo').forEach(el => el.remove());
            document.querySelectorAll('.transparency-form .form-group').forEach(el => el.classList.remove('has-error'));
            
            // Validar nombre
            const nombre = document.getElementById('nombre');
            if (!nombre || !nombre.value.trim()) {
                mostrarErrorTransparencia(nombre, 'El nombre es requerido');
                esValido = false;
            }
            
            // Validar email
            const email = document.getElementById('email');
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !email.value.trim()) {
                mostrarErrorTransparencia(email, 'El email es requerido');
                esValido = false;
            } else if (!regexEmail.test(email.value)) {
                mostrarErrorTransparencia(email, 'Ingresa un email válido');
                esValido = false;
            }
            
            // Validar consulta
            const consulta = document.getElementById('consulta');
            if (!consulta || !consulta.value.trim()) {
                mostrarErrorTransparencia(consulta, 'Por favor, escribe tu consulta');
                esValido = false;
            } else if (consulta.value.trim().length < 10) {
                mostrarErrorTransparencia(consulta, 'La consulta debe tener al menos 10 caracteres');
                esValido = false;
            }
            
            return esValido;
        };
        
        // Función para mostrar errores
        const mostrarErrorTransparencia = (elemento, mensaje) => {
            if (!elemento) return;
            const formGroup = elemento.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('has-error');
                const errorDiv = document.createElement('span');
                errorDiv.className = 'error-campo';
                errorDiv.textContent = mensaje;
                errorDiv.style.cssText = `
                    display: block;
                    color: #ff6b6b;
                    font-size: 12px;
                    margin-top: 5px;
                    font-weight: 500;
                `;
                elemento.parentNode.insertBefore(errorDiv, elemento.nextSibling);
            }
        };
        
        formularioTransparencia.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar antes de enviar
            if (!validarFormularioTransparencia()) {
                return;
            }
            
            // URL del App Script de Google
            const apiUrl = 'https://script.google.com/macros/s/AKfycbwZFGPQkZuTU-IuiQ_HUqc6_NXpJFJabcTCMAyr-nuFnGSR-_-MkyjFJf9uX_0q1R4YsQ/exec';
            
            // Recopilar datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                consulta: document.getElementById('consulta').value.trim(),
                tipo_formulario: 'transparencia',
                timestamp: new Date().toLocaleString('es-ES')
            };
            
            try {
                // Mostrar indicador de envío
                const submitBtn = formularioTransparencia.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Enviar datos al API
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: encodeFormData(formData)
                });
                
                // Mostrar mensaje de éxito
                formularioTransparencia.innerHTML = `
                    <div class="success-message fade-in" style="text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
                        <h3 style="margin: 0 0 15px 0; font-size: 24px;">¡Gracias por tu consulta!</h3>
                        <p style="margin: 0 0 10px 0; font-size: 16px;">Hemos recibido tu pregunta correctamente.</p>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Te responderemos en la brevedad posible a la dirección de email proporcionada.</p>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error al enviar consulta de transparencia:', error);
                
                // Mostrar mensaje de error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.cssText = `
                    background-color: #ff6b6b;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    text-align: center;
                `;
                errorDiv.textContent = 'Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.';
                formularioTransparencia.appendChild(errorDiv);
                
                // Restaurar botón
                const submitBtn = formularioTransparencia.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Enviar Consulta';
                submitBtn.disabled = false;
            }
        });
    }
});

// ==================== MAPA - EVENT LISTENER ====================
document.addEventListener('DOMContentLoaded', () => {
    const mapCard = document.getElementById('mapCard');
    if (mapCard) {
        mapCard.addEventListener('click', () => {
            mapCard.classList.add('active');
        });
    }
});

