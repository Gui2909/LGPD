document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const dotsContainer = document.getElementById('dots-container');
    const progressBar = document.getElementById('slide-progress');
    const themeToggleBtn = document.getElementById('btn-theme-toggle');
    const fullscreenBtn = document.getElementById('btn-fullscreen');
    
    // ==========================================================================
    // STATE VARIABLES
    // ==========================================================================
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    function init() {
        createDots();
        updateSlides();
        loadSavedTheme();
    }

    // ==========================================================================
    // SLIDE NAVIGATION
    // ==========================================================================
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlides() {
        // Activate correct slide class
        slides.forEach((slide, index) => {
            if (index === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update Dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update Progress Bar
        const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Enable/Disable Nav buttons
        btnPrev.disabled = currentSlideIndex === 0;
        btnNext.disabled = currentSlideIndex === totalSlides - 1;
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlideIndex = index;
            updateSlides();
        }
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    }

    // ==========================================================================
    // THEME SWITCHER & UTILS
    // ==========================================================================
    function toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('presentation-theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('presentation-theme', 'dark');
        }
    }

    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('presentation-theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error enabling fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // ==========================================================================
    // EVENT LISTENERS
    // ==========================================================================
    
    // Navigation Clicks
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);
    
    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        } else if (e.key === 't' || e.key === 'T') {
            toggleTheme();
        }
    });

    // Theme and Fullscreen Clicks
    themeToggleBtn.addEventListener('click', toggleTheme);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Touch support (Swipe gestures for mobile/tablets)
    let touchStartX = 0;
    let touchEndX = 0;
    
    const container = document.getElementById('slides-container');
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const threshold = 50; // min distance
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // swipe left -> next slide
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide(); // swipe right -> prev slide
        }
    }

    // Initialize presentation
    init();

});
