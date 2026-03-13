function scrollSlider(direction, sliderId = 'main-slider') {
    const slider = document.getElementById(sliderId); 
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

function toggleLangMenu() {
    const langList = document.getElementById('lang-list');
    langList.classList.toggle('active');
}

function closeLangMenu() {
    const langList = document.getElementById('lang-list');
    if (langList.classList.contains('active')) {
        langList.classList.remove('active');
    }
}

// Close mobile menus when clicking outside or selecting an item
document.addEventListener('click', (event) => {
    const navList = document.getElementById('nav-list');
    const langList = document.getElementById('lang-list');
    const menuIcon = document.querySelector('.menu-icon');
    const langMenuIcon = document.querySelector('.lang-menu-icon');
    
    if (!navList.contains(event.target) && !menuIcon.contains(event.target) && navList.classList.contains('active')) {
        closeMenu();
    }
    
    if (!langList.contains(event.target) && !langMenuIcon.contains(event.target) && langList.classList.contains('active')) {
        closeLangMenu();
    }
});

const navItems = document.querySelectorAll('#nav-list > li > a');
navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        closeMenu();
    });
});


