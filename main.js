document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Touch device detection
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    // 2. Custom Cursor Logic (Only for Desktop/Mouse users)
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const spotlight = document.getElementById('ambient-spotlight');

    if (isTouchDevice) {
        // Remove cursor elements entirely on mobile/touch screens
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
        
        // Static ambient glow overlay (centered slightly)
        if (spotlight) {
            spotlight.style.background = 'radial-gradient(circle at 50% 30%, rgba(91, 58, 41, 0.12), transparent 70%)';
        }
    } else {
        // Desktop mouse tracking spotlight & cursor
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (spotlight) {
                spotlight.style.background = `radial-gradient(circle 350px at ${e.clientX}px ${e.clientY}px, rgba(201, 162, 106, 0.08), transparent 85%)`;
            }
        });

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.18;
            cursorY += (mouseY - cursorY) * 0.18;
            
            followerX += (mouseX - followerX) * 0.09;
            followerY += (mouseY - followerY) * 0.09;

            if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            if (follower) follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Hover cursor transformations
        const interactives = document.querySelectorAll('a, button, input, select, textarea, .gallery-item, .filter-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => follower && follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower && follower.classList.remove('hovering'));
        });

        // Toggle visibility when leaving viewport
        document.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.opacity = 0;
            if (follower) follower.style.opacity = 0;
        });
        document.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.opacity = 1;
            if (follower) follower.style.opacity = 1;
        });
    }


    // 3. Ambient Wood Dust Particles (Canvas Engine with Mobile scaling)
    const canvas = document.getElementById('dust-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        // Drop particle count on mobile touch devices to optimize frame rate
        const particleCount = isTouchDevice ? 15 : 40;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.size = Math.random() * (isTouchDevice ? 1.5 : 2) + 0.5;
                this.speedY = -(Math.random() * 0.35 + 0.08);
                this.speedX = Math.random() * 0.2 - 0.1;
                this.alpha = Math.random() * 0.35 + 0.08;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                if (this.y < 80) {
                    this.alpha -= 0.006;
                }

                if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 162, 106, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }


    // 4. Header Scroll styling
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // 5. Mobile Navigation Overlay
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .btn-commission-mobile');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // 6. Interactive 3D Mouse Parallax (Disabled on touch devices for performance)
    const heroSec = document.getElementById('hero');
    const sculptureImg = document.querySelector('.hero-sculpture-img');

    if (heroSec && sculptureImg && !isTouchDevice) {
        heroSec.addEventListener('mousemove', (e) => {
            const { width, height } = heroSec.getBoundingClientRect();
            const centerX = width / 2;
            const centerY = height / 2;
            const moveX = (e.clientX - centerX) / centerX;
            const moveY = (e.clientY - centerY) / centerY;

            gsap.to(sculptureImg, {
                rotateY: moveX * 10,
                rotateX: -moveY * 10,
                x: moveX * 15,
                y: moveY * 15,
                duration: 0.6,
                ease: "power1.out"
            });
        });

        heroSec.addEventListener('mouseleave', () => {
            gsap.to(sculptureImg, {
                rotateY: 0,
                rotateX: 0,
                x: 0,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            });
        });
    }


    // 7. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Init reveals
        const heroTL = gsap.timeline();
        heroTL.fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
              .fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
              .fromTo('.hero-actions', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
              .fromTo('.hero-sculpture-wrapper', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "-=0.9");

        // Universal fade reveals
        gsap.utils.toArray('.fade-in-up').forEach(elem => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 88%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Parallax image on craftsmanship
        const parallaxContainer = document.querySelector('.parallax-img-container');
        const parallaxImg = document.querySelector('.craftsmanship-img');
        if (parallaxContainer && parallaxImg) {
            gsap.to(parallaxImg, {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: parallaxContainer,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Statistics Count Up
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            gsap.to(num, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: num,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });
    }


    // 8. Curated Gallery Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const val = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (val === 'all' || category === val) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.35,
                        display: 'block',
                        ease: "power1.out"
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.35,
                        display: 'none',
                        ease: "power1.out"
                    });
                }
            });
        });
    });


    // 9. Fullscreen Lightbox Modal
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxMeta = lightbox.querySelector('.lightbox-meta');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let activeItems = [];
    let currentIdx = 0;

    const syncActiveItems = () => {
        activeItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            syncActiveItems();
            currentIdx = activeItems.indexOf(item);
            openLightbox(item);
        });
    });

    const openLightbox = (item) => {
        const thumb = item.querySelector('.gallery-img-thumb');
        const tag = item.querySelector('.item-tag').innerText;
        const title = item.querySelector('h4').innerText;
        const meta = item.querySelector('.item-meta').innerText;

        lightboxImg.src = thumb.src;
        lightboxCategory.innerText = tag;
        lightboxTitle.innerText = title;
        lightboxMeta.innerText = meta;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const prevImage = () => {
        if (activeItems.length === 0) syncActiveItems();
        currentIdx = (currentIdx - 1 + activeItems.length) % activeItems.length;
        gsap.fromTo(lightboxImg, { opacity: 0.5, x: 10 }, { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" });
        openLightbox(activeItems[currentIdx]);
    };

    const nextImage = () => {
        if (activeItems.length === 0) syncActiveItems();
        currentIdx = (currentIdx + 1) % activeItems.length;
        gsap.fromTo(lightboxImg, { opacity: 0.5, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" });
        openLightbox(activeItems[currentIdx]);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });


    // 10. Contact Form Submissions
    const form = document.getElementById('inquiry-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.className = 'form-status';
            formStatus.innerText = 'Transmitting your inquiry details...';

            setTimeout(() => {
                form.reset();
                formStatus.classList.add('success');
                formStatus.innerText = 'Inquiry received. A bespoke art curator will contact you within 24 hours.';
            }, 1200);
        });
    }
});
