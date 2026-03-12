function scrollSlider(direction) {
    // This MUST match the id above
    const slider = document.getElementById('main-slider'); 
    const scrollAmount = slider.clientWidth;
    
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}