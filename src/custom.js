(function($) {
    "use strict";

    // Sticky Header
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 100) {
            $('.header-area').addClass('sticky');
        } else {
            $('.header-area').removeClass('sticky');
        }
    });

    // Mobile Menu
    $('.mobile-menu').on('click', function() {
        $('.main-nav').addClass('slidenav');
        $('.cross-btn').addClass('h-active');
    });
    $('.remove').on('click', function() {
        $('.main-nav').removeClass('slidenav');
        $('.cross-btn').removeClass('h-active');
    });

    // Swiper Slider
    const heroSlider = new Swiper('.hero-slide', {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const servicesSlider = new Swiper('.services-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });

    const partnerSlider = new Swiper('.partner-slider', {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
        },
        navigation: {
            nextEl: '.swiper-button-next-c',
            prevEl: '.swiper-button-prev-c',
        },
        breakpoints: {
            576: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 }
        }
    });

    const teamSlider = new Swiper('.team-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 }
        }
    });

    const testimonialSlider = new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Counter Up
    $('.counter').counterUp({
        delay: 10,
        time: 2000
    });

    // Isotope Filter - Wait for images to load
    var $grid = $('.project-items');
    
    if ($grid.length) {
        // Initialize Isotope after all images are loaded
        $grid.imagesLoaded = function() {
            return new Promise(resolve => {
                let images = $grid.find('img');
                let loadedCount = 0;
                let totalImages = images.length;
                
                if (totalImages === 0) {
                    resolve();
                    return;
                }
                
                images.each(function() {
                    if (this.complete) {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    } else {
                        $(this).on('load error', function() {
                            loadedCount++;
                            if (loadedCount === totalImages) resolve();
                        });
                    }
                });
            });
        };
        
        // Initialize isotope
        $grid.imagesLoaded().then(function() {
            $grid.isotope({
                itemSelector: '.single-item',
                layoutMode: 'fitRows',
                percentPosition: true
            });
        });
        
        // Filter click handler
        $('.isotope-menu li').on('click', function() {
            // Update active state
            $('.isotope-menu li').removeClass('active');
            $(this).addClass('active');
            
            // Get filter value
            var filterValue = $(this).attr('data-filter');
            
            // Apply filter
            $grid.isotope({ filter: filterValue });
        });
        
        // Trigger layout after a short delay to ensure proper rendering
        setTimeout(function() {
            $grid.isotope('layout');
        }, 500);
    }

    // Video Popup
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    // WOW JS
    // new WOW().init();

    // Cursor
    // const cursor = document.querySelector('.cursor');
    // document.addEventListener('mousemove', e => {
    //     cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;");
    // });

})(jQuery);
