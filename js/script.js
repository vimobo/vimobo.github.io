function scrollSlider(direction) {
    // This MUST match the id above
    const slider = document.getElementById('main-slider'); 
    const scrollAmount = slider.clientWidth;
    
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function toggleMenu() {
    const navList = document.getElementById('nav-list');
    navList.classList.toggle('active');
}

function closeMenu() {
    const navList = document.getElementById('nav-list');
    if (navList.classList.contains('active')) {
        navList.classList.remove('active');
    }
}

// Close mobile menu when clicking outside or selecting an item
document.addEventListener('click', (event) => {
    const navList = document.getElementById('nav-list');
    const menuIcon = document.querySelector('.menu-icon');
    if (!navList.contains(event.target) && !menuIcon.contains(event.target) && navList.classList.contains('active')) {
        closeMenu();
    }
});

const navItems = document.querySelectorAll('#nav-list > li > a');
navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        const parentLi = item.parentElement;

        // No cerrar el menú al tocar el item con submenu (ES), para poder ver EN/CAT en móvil
        if (parentLi.classList.contains('has-submenu')) {
            event.preventDefault();
            parentLi.classList.toggle('submenu-open');
            return;
        }

        closeMenu();
    });
});

// For mobile submenu open state
const style = document.createElement('style');
style.textContent = `
@media screen and (max-width: 768px) {
    #nav-list li.has-submenu.submenu-open > ul {
        display: block !important;
    }
    #nav-list li.has-submenu > ul {
        display: none;
    }
}
`;
document.head.appendChild(style);


