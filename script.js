console.log('--- SCRIPT JS STARTED ---'); // Keep this line for initial check

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script is running!'); // Confirm DOMContentLoaded fires

    // 1. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 2. Update copyright year dynamically
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 3. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for user's preferred theme from localStorage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggle.textContent = '🌙'; // Set moon icon if dark mode is active
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no preference in localStorage, check system preference
        body.classList.add('dark-mode');
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            themeToggle.textContent = '☀️'; // Sun icon for light mode
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.textContent = '🌙'; // Moon icon for dark mode
        }
    });

    // 4. Typewriter Effect for Hero Headline
    const typewriterTextElement = document.getElementById('typewriter-text');
    if (typewriterTextElement) {
        const words = ['websites', 'products', 'experiences', 'interfaces'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100; // milliseconds per character
        const deletingSpeed = 50;
        const delayBetweenWords = 1500; // milliseconds

        function typeWriter() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Word is typed, start deleting after a delay
                setTimeout(() => isDeleting = true, delayBetweenWords);
            } else if (isDeleting && charIndex === 0) {
                // Word is deleted, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
            setTimeout(typeWriter, currentSpeed);
        }

        typeWriter(); // Start the effect
    }

    // 5. Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px down
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Scroll-triggered animations (Intersection Observer)
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const fadeInItems = document.querySelectorAll('.fade-in-item'); // For individual items

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optional: Stop observing once animated
            } else {
                // Optional: Remove class when out of view if you want repeatable animation
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });

    const itemObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing individual items once animated
            }
        });
    }, observerOptions);

    fadeInItems.forEach(item => {
        itemObserver.observe(item);
    });

    // --- Lightbox/Gallery Functionality ---
    // ALL LIGHTBOX VARIABLES AND FUNCTIONS MUST BE DECLARED WITHIN THIS DOMContentLoaded SCOPE
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let galleryImages = [];

    // --- FIX: This selector is now GENERIC to work on all pages ---
    document.querySelectorAll('[data-lightbox-gallery]').forEach(img => {
        galleryImages.push(img); // Collect all gallery images
        img.style.cursor = 'zoom-in'; // Indicate it's clickable
        img.addEventListener('click', () => {
            openLightbox(img);
        });
    });

    console.log('Images found for lightbox:', galleryImages.length, galleryImages); // ADD THIS LINE IMMEDIATELY AFTER THE FOR EACH LOOP

    // Function to open the lightbox
    function openLightbox(imgElement) {
        lightbox.style.display = 'flex'; // Make it visible instantly for transition
        // Add class to body to prevent scrolling background
        document.body.classList.add('lightbox-open'); // ADDED THIS
        setTimeout(() => { // Small delay to allow 'display' change before 'opacity' transition
            lightbox.classList.add('active');
            const fullSrc = imgElement.getAttribute('data-src-full') || imgElement.src;
            lightboxImg.src = fullSrc;
            lightboxCaption.textContent = imgElement.alt;
            currentImageIndex = galleryImages.indexOf(imgElement);
        }, 10); // Very short delay
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        // Remove class from body to allow scrolling background again
        document.body.classList.remove('lightbox-open'); // ADDED THIS
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }

    // Function to show next/previous image
    function showImage(index) {
        if (index >= galleryImages.length) {
            currentImageIndex = 0; // Loop back to start
        } else if (index < 0) {
            currentImageIndex = galleryImages.length - 1; // Loop to end
        } else {
            currentImageIndex = index;
        }
        
        const imgElement = galleryImages[currentImageIndex];
        const fullSrc = imgElement.getAttribute('data-src-full') || imgElement.src;
        
        lightboxImg.style.transform = 'scale(0.8)'; // Reset for re-animation
        setTimeout(() => {
            lightboxImg.src = fullSrc;
            lightboxCaption.textContent = imgElement.alt;
            lightboxImg.style.transform = 'scale(1)'; // Animate in
        }, 50); // Small delay to trigger animation
    }

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));

    // Close lightbox on overlay click (but not on image click)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Only close if clicking the background, not the image
            closeLightbox();
        }
    });

    // Keyboard navigation (Escape, Left, Right arrows)
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentImageIndex + 1);
            }
        }
    });
});