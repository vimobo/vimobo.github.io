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
    backgroundMusic.volume = 1;

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
        '.fade-up, .fade-left, .fade-in, .fade-in-shadow'
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
    let autoplayInterval;
    let userInteracted = false;
    let resumeAutoplayTimeout;
    let carouselVisible = false;
    let isFirstImage = true;

    const updateCarousel = () => {
        const size = carouselImages[0].clientWidth;
        carouselSlide.style.transform = `translateX(${-counter * size}px)`;
    };

    const startAutoplay = () => {
        stopAutoplay();

        const firstImageDuration = isFirstImage ? 7000 : 4000;

        autoplayInterval = setTimeout(() => {
            counter++;
            if (counter >= carouselImages.length) counter = 0;
            isFirstImage = false;
            updateCarousel();
            startAutoplay();
        }, firstImageDuration);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearTimeout(autoplayInterval);
        }
    };

    const resumeAutoplayAfterDelay = () => {
        clearTimeout(resumeAutoplayTimeout);
        resumeAutoplayTimeout = setTimeout(() => {
            userInteracted = false;
            startAutoplay();
        }, 10000);
    };

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            userInteracted = true;
            stopAutoplay();
            counter++;
            if (counter >= carouselImages.length) counter = 0;
            isFirstImage = false;
            updateCarousel();
            resumeAutoplayAfterDelay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            userInteracted = true;
            stopAutoplay();
            counter--;
            if (counter < 0) counter = carouselImages.length - 1;
            isFirstImage = false;
            updateCarousel();
            resumeAutoplayAfterDelay();
        });
    }

    // Intersection Observer para iniciar cuando es visible
    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !carouselVisible) {
                    carouselVisible = true;
                    isFirstImage = true;
                    counter = 0;
                    updateCarousel();
                    startAutoplay();
                } else if (!entry.isIntersecting && carouselVisible) {
                    carouselVisible = false;
                    stopAutoplay();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(carouselContainer);
    } else {
        // Fallback si no encuentra el contenedor
        carouselVisible = true;
        startAutoplay();
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

    let wordIndex = 0;
    const parts = [];

    el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split(/(\s+)/).forEach(token => {
                if (/\S/.test(token)) {
                    parts.push(`<span class="word-anim" style="transition-delay:${wordIndex * staggerMs}ms">${token}</span>`);
                    wordIndex++;
                } else if (token) {
                    parts.push(token);
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const cls = node.getAttribute('class') || '';
            const sty = node.getAttribute('style') || '';
            parts.push(`<${tag} class="${cls} word-anim" style="${sty}transition-delay:${wordIndex * staggerMs}ms">${node.innerHTML}</${tag}>`);
            wordIndex++;
        }
    });

    el.innerHTML = parts.join('');

    const trigger = () =>
        el.querySelectorAll('.word-anim').forEach(s => s.classList.add('in'));

    if (!('IntersectionObserver' in window)) { trigger(); return; }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { trigger(); obs.unobserve(el); }
        });
    }, { threshold: 0.15 });

    observer.observe(el);
}


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
    const section2P = document.querySelector('#section2 p');

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

            // Validar "¿Cómo nos has conocido?"
            const comoConociste = document.getElementById('como-conociste');
            if (!comoConociste.value.trim()) {
                mostrarError(comoConociste, 'Por favor, cuéntanos cómo nos conociste');
                esValido = false;
            }

            // Validar práctica e intereses
            const practica = document.getElementById('practica');
            if (!practica.value.trim()) {
                mostrarError(practica, 'Por favor, explica brevemente tu práctica e intereses');
                esValido = false;
            }

            // Validar motivación
            const motivacion = document.getElementById('motivacion');
            if (!motivacion.value.trim()) {
                mostrarError(motivacion, 'Por favor, cuéntanos qué te motiva a participar');
                esValido = false;
            }

            // Validar hospedaje (radio buttons)
            const hospedajeRadios = document.querySelectorAll('input[name="hospedaje"]');
            const hospedajeSeleccionado = Array.from(hospedajeRadios).some(r => r.checked);
            if (!hospedajeSeleccionado) {
                const hospedajeGroup = document.querySelector('input[name="hospedaje"]').closest('.form-group');
                mostrarError(hospedajeGroup, 'Selecciona un tipo de hospedaje');
                esValido = false;
            }

            // Validar llegada
            const llegada = document.getElementById('llegada');
            if (!llegada.value) {
                mostrarError(llegada, 'Selecciona cuándo llegarás al encuentro');
                esValido = false;
            }

            // Validar vehículo (radio buttons)
            const vehiculoRadios = document.querySelectorAll('input[name="vehiculo"]');
            const vehiculoSeleccionado = Array.from(vehiculoRadios).some(r => r.checked);
            if (!vehiculoSeleccionado) {
                const vehiculoGroup = document.querySelector('input[name="vehiculo"]').closest('.form-group');
                mostrarError(vehiculoGroup, 'Selecciona si dispones de vehículo');
                esValido = false;
            }

            // Validar compañía
            const compania = document.getElementById('compania');
            if (!compania.value.trim()) {
                mostrarError(compania, 'Por favor, cuéntanos con quién vienes');
                esValido = false;
            }

            // Validar procedencia
            const procedencia = document.getElementById('procedencia');
            if (!procedencia.value.trim()) {
                mostrarError(procedencia, 'Por favor, cuéntanos desde dónde vienes');
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

        // Validación en tiempo real para cada campo
        const campos = formulario.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.addEventListener('blur', () => {
                // Validar campo individual
                const formGroup = campo.closest('.form-group');
                if (formGroup) {
                    // Limpiar errores previos
                    formGroup.querySelectorAll('.error-campo').forEach(el => el.remove());
                    formGroup.classList.remove('has-error');

                    // Validar con HTML5
                    if (!campo.checkValidity()) {
                        const mensaje = campo.validationMessage || 'Este campo no es válido';
                        mostrarError(campo, mensaje);
                    }
                }
            });

            campo.addEventListener('input', () => {
                // Limpiar error cuando el usuario empieza a escribir
                const formGroup = campo.closest('.form-group');
                if (formGroup && formGroup.classList.contains('has-error')) {
                    formGroup.querySelectorAll('.error-campo').forEach(el => el.remove());
                    formGroup.classList.remove('has-error');
                }
            });
        });

        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar con HTML5 nativo primero
            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }

            // Validar con JavaScript personalizado
            if (!validarFormulario()) {
                return;
            }

            // URL del App Script de Google
            const apiUrl = 'https://script.google.com/macros/s/AKfycbwvr-jym-BFY63inD4V5so_n8ijhMKxAWTZwe_v871soOxbMEvEpU_LIxLVsDIi2mcW9Q/exec';

            // Recopilar datos del formulario
            const hospedajeSeleccionado = document.querySelector('input[name="hospedaje"]:checked');
            const vehiculoSeleccionado = document.querySelector('input[name="vehiculo"]:checked');

            const llegadaValue = document.getElementById('llegada').value;
            const llegadaFinal = llegadaValue === 'otro'
                ? document.getElementById('otro-llegada-texto').value.trim()
                : llegadaValue;

            const formData = {
                timestamp: new Date().toLocaleString('es-ES'),
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                como_conociste: document.getElementById('como-conociste').value.trim(),
                practica_intereses: document.getElementById('practica').value.trim(),
                hospedaje: hospedajeSeleccionado ? hospedajeSeleccionado.value : '',
                llegada: llegadaFinal,
                compania: document.getElementById('compania').value.trim(),
                procedencia: document.getElementById('procedencia').value.trim(),
                vehiculo: vehiculoSeleccionado ? vehiculoSeleccionado.value : '',
                plazas_disponibles: vehiculoSeleccionado && vehiculoSeleccionado.value === 'si' && document.getElementById('plazas').value ? document.getElementById('plazas').value : '',
                enlace: document.getElementById('enlace').value.trim(),
                comentarios_adicionales: document.getElementById('comentarios').value.trim(),
                tipo_formulario: 'inscripcion'
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

        // Manejar campo condicional para llegada "Otro"
        const llegadaSelect = document.getElementById('llegada');
        const otroLlegadaGrupo = document.getElementById('otro-llegada');

        if (llegadaSelect && otroLlegadaGrupo) {
            llegadaSelect.addEventListener('change', () => {
                if (llegadaSelect.value === 'otro') {
                    otroLlegadaGrupo.style.display = 'block';
                    document.getElementById('otro-llegada-texto').required = true;
                } else {
                    otroLlegadaGrupo.style.display = 'none';
                    document.getElementById('otro-llegada-texto').required = false;
                }
            });
        }

        // Manejar campo condicional para vehículo
        const vehiculoRadios = document.querySelectorAll('input[name="vehiculo"]');
        const plazasGrupo = document.getElementById('plazas-grupo');

        if (vehiculoRadios.length > 0 && plazasGrupo) {
            vehiculoRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'si' && radio.checked) {
                        plazasGrupo.style.display = 'block';
                    } else if (radio.value === 'no' && radio.checked) {
                        plazasGrupo.style.display = 'none';
                        document.getElementById('plazas').value = '';
                    }
                });
            });
        }
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

        // Validación en tiempo real para cada campo
        const camposTransparencia = formularioTransparencia.querySelectorAll('input, textarea');
        camposTransparencia.forEach(campo => {
            campo.addEventListener('blur', () => {
                // Validar campo individual
                const formGroup = campo.closest('.form-group');
                if (formGroup) {
                    // Limpiar errores previos
                    formGroup.querySelectorAll('.error-campo').forEach(el => el.remove());
                    formGroup.classList.remove('has-error');

                    // Validar con HTML5
                    if (!campo.checkValidity()) {
                        const mensaje = campo.validationMessage || 'Este campo no es válido';
                        mostrarErrorTransparencia(campo, mensaje);
                    }
                }
            });

            campo.addEventListener('input', () => {
                // Limpiar error cuando el usuario empieza a escribir
                const formGroup = campo.closest('.form-group');
                if (formGroup && formGroup.classList.contains('has-error')) {
                    formGroup.querySelectorAll('.error-campo').forEach(el => el.remove());
                    formGroup.classList.remove('has-error');
                }
            });
        });

        formularioTransparencia.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validar con HTML5 nativo primero
            if (!formularioTransparencia.checkValidity()) {
                formularioTransparencia.reportValidity();
                return;
            }

            // Validar con JavaScript personalizado
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

// ==================== POPUPS DE HERRAMIENTAS EN EQUIPO ====================
document.addEventListener('DOMContentLoaded', () => {
    const teamPhotos = document.querySelectorAll('.team-photo');
    const hintPopup = document.getElementById('team-hint-popup');
    let hintDismissed = false;

    teamPhotos.forEach(photo => {
        const popup = photo.querySelector('.tool-popup');
        if (!popup) return;

        const updatePopupPosition = () => {
            popup.classList.remove('left', 'right', 'top', 'bottom');

            setTimeout(() => {
                const photoRect = photo.getBoundingClientRect();
                const viewport = window.innerWidth;

                // En móvil (viewport <= 768px): siempre abajo
                if (viewport <= 768) {
                    popup.classList.add('bottom');
                } else {
                    // En desktop: derecha o izquierda según espacio
                    const spaceRight = viewport - photoRect.right;
                    const spaceLeft = photoRect.left;

                    if (spaceRight >= 160) {
                        popup.classList.add('right');
                    } else if (spaceLeft >= 160) {
                        popup.classList.add('left');
                    } else {
                        popup.classList.add('right');
                    }
                }
            }, 0);
        };

        // Desktop: mouseenter
        photo.addEventListener('mouseenter', updatePopupPosition);

        // Móvil: click para mostrar/ocultar
        if (window.innerWidth <= 768) {
            photo.addEventListener('click', (e) => {
                e.stopPropagation();

                // Ocultar hint popup al primer click
                if (hintPopup && !hintDismissed) {
                    hintPopup.classList.add('hidden');
                    hintDismissed = true;
                }

                popup.style.opacity = popup.style.opacity === '1' ? '0' : '1';
                popup.style.pointerEvents = popup.style.opacity === '1' ? 'auto' : 'none';
                updatePopupPosition();
            });

            // Cerrar al hacer click fuera
            document.addEventListener('click', () => {
                popup.style.opacity = '0';
                popup.style.pointerEvents = 'none';
            });
        } else {
            // Desktop: ocultar hint popup al hacer hover
            photo.addEventListener('mouseenter', () => {
                if (hintPopup && !hintDismissed) {
                    hintPopup.classList.add('hidden');
                    hintDismissed = true;
                }
            });
        }
    });

    // Ocultar hint popup después de 5 segundos automáticamente
    if (hintPopup) {
        setTimeout(() => {
            if (!hintDismissed) {
                hintPopup.classList.add('hidden');
                hintDismissed = true;
            }
        }, 5000);
    }
});

// ==================== AUTOPLAY PARA CARRUSELES DE HISTORIA ====================
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que HistoryCarousel se instancie
    setTimeout(() => {
        const innerCarousels = document.querySelectorAll('.inner-carousel');

        innerCarousels.forEach((carousel) => {
            const edition = carousel.dataset.edition;
            const slides = carousel.querySelectorAll('.inner-slide');
            let autoplayInterval = null;
            let resumeTimeout = null;
            let isVisible = false;

            const getNextSlide = () => {
                // Obtener el índice actual del transform
                const transform = carousel.style.transform || 'translateX(0%)';
                const match = transform.match(/translateX\((-?\d+)%\)/);
                let currentSlide = 0;

                if (match) {
                    const percentage = parseInt(match[1]);
                    currentSlide = Math.abs(percentage) / 100;
                }

                currentSlide++;
                if (currentSlide >= slides.length) {
                    currentSlide = 0;
                }
                return currentSlide;
            };

            const updateCarouselToSlide = (slideIndex) => {
                const offset = -slideIndex * 100;
                carousel.style.transform = `translateX(${offset}%)`;

                // Actualizar indicadores
                const indicators = document.querySelectorAll(`.inner-carousel-indicators[data-edition="${edition}"] .inner-indicator`);
                indicators.forEach((ind, index) => {
                    ind.classList.toggle('active', index === slideIndex);
                });
            };

            const startAutoplay = () => {
                if (!isVisible) return;
                if (autoplayInterval) clearInterval(autoplayInterval);

                autoplayInterval = setInterval(() => {
                    if (isVisible) {
                        const nextSlide = getNextSlide();
                        updateCarouselToSlide(nextSlide);
                    }
                }, 4000);
            };

            const stopAutoplay = () => {
                if (autoplayInterval) clearInterval(autoplayInterval);
                autoplayInterval = null;
            };

            const resumeAutoplayAfterDelay = () => {
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => {
                    if (isVisible) {
                        startAutoplay();
                    }
                }, 10000);
            };

            // Agregar eventos a botones
            const prevBtn = document.querySelector(`.inner-prev[data-edition="${edition}"]`);
            const nextBtn = document.querySelector(`.inner-next[data-edition="${edition}"]`);

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    stopAutoplay();
                    resumeAutoplayAfterDelay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    stopAutoplay();
                    resumeAutoplayAfterDelay();
                });
            }

            // Agregar eventos a indicadores
            const indicators = document.querySelectorAll(`.inner-carousel-indicators[data-edition="${edition}"] .inner-indicator`);
            indicators.forEach((indicator) => {
                indicator.addEventListener('click', () => {
                    stopAutoplay();
                    resumeAutoplayAfterDelay();
                });
            });

            // IntersectionObserver para detectar visibilidad
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isVisible) {
                        isVisible = true;
                        carousel.style.transform = `translateX(0%)`;
                        updateCarouselToSlide(0);
                        startAutoplay();
                    } else if (!entry.isIntersecting && isVisible) {
                        isVisible = false;
                        stopAutoplay();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(carousel);
        });
    }, 100);
});



