document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 0. Preloader Logic
    // ==========================================
    const preloader = document.getElementById('preloader');
    
    const removePreloader = () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('hero-start');
            }, 600);
        } else {
            document.body.classList.add('hero-start');
        }
    };

    // Fallback timeout to guarantee preloader disappears after 1.5s
    const preloaderTimeout = setTimeout(removePreloader, 1500);

    window.addEventListener('load', () => {
        clearTimeout(preloaderTimeout);
        // Slight delay to show loading progress bar nicely
        setTimeout(removePreloader, 300);
    });

    console.log("Premium Hub initialized.");

    const projectCards = document.querySelectorAll('.project-card');

    // ==========================================
    // 1. Smooth Scroll to Anchors & Task Prefill
    // ==========================================
    const scrollLinks = document.querySelectorAll('.scroll-to');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Prefill selected service type into the contact task field
            const selectedTask = link.getAttribute('data-task');
            if (selectedTask) {
                const taskTextarea = document.getElementById('contact-task');
                if (taskTextarea) {
                    taskTextarea.value = `Здравствуйте! Меня интересует разработка услуги: "${selectedTask}". \nСфера бизнеса: `;
                    // Focus cursor on textarea after scroll
                    setTimeout(() => {
                        taskTextarea.focus();
                        // Move cursor to the end of the text
                        taskTextarea.setSelectionRange(taskTextarea.value.length, taskTextarea.value.length);
                    }, 800);
                }
            }

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // 2. Services Info/For Whom Toggles
    // ==========================================
    const infoToggleBtns = document.querySelectorAll('.info-toggle-btn');
    infoToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.service-card');
            if (!card) return;

            // Update buttons active class
            card.querySelectorAll('.info-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch texts visibility
            const targetId = btn.getAttribute('data-target');
            card.querySelectorAll('.service-text').forEach(textBlock => {
                textBlock.classList.remove('active');
                if (textBlock.getAttribute('id') === targetId) {
                    textBlock.classList.add('active');
                }
            });
        });
    });

    // ==========================================
    // 3. Universal Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('universal-contact-form');
    const formSuccessMsg = document.querySelector('.form-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const linkInput = document.getElementById('contact-link');
            const taskTextarea = document.getElementById('contact-task');
            const submitBtn = contactForm.querySelector('.btn-submit-form');

            const name = nameInput.value.trim();
            const contact = linkInput.value.trim();
            const task = taskTextarea.value.trim();

            if (!name || !contact || !task) {
                alert('Пожалуйста, заполните все поля формы.');
                return;
            }

            // Simulate sending data
            submitBtn.innerText = 'Отправка запроса...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.style.display = 'none';
                nameInput.style.display = 'none';
                linkInput.style.display = 'none';
                taskTextarea.style.display = 'none';

                if (formSuccessMsg) {
                    formSuccessMsg.innerText = `Спасибо, ${name}! Ваша заявка успешно отправлена. Мы свяжемся с вами в Telegram/Телефону в течение часа для детального обсуждения.`;
                    formSuccessMsg.style.display = 'block';
                }
            }, 1200);
        });
    }

    // ==========================================
    // 4. 3D Tilt Effect on Project Cards
    // ==========================================
    const isDesktop = window.matchMedia("(pointer: fine)").matches;

    if (isDesktop && projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const maxRotateX = 10;
                const maxRotateY = 10;

                card.style.transition = "none";
                
                card.style.transform = `
                    rotateY(${x * maxRotateY}deg) 
                    rotateX(${-y * maxRotateX}deg) 
                    translateY(-10px) 
                    translateZ(20px)
                `;
            });

            card.style.transformStyle = "preserve-3d";

            card.addEventListener("mouseleave", () => {
                card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, background-color 0.4s, box-shadow 0.4s";
                card.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0) translateZ(0)";
            });
        });
    }

    // ==========================================
    // 4.5 Cinematic Projects Slider (Snap-to-Center)
    // ==========================================
    const slider = document.querySelector('.projects-slider');
    const sliderWindow = document.querySelector('.slider-window');
    const cards = document.querySelectorAll('.projects-slider .project-card');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slider && cards.length > 0) {
        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        // Update slider positioning (Centering the active slide)
        const updateSliderPosition = () => {
            if (!sliderWindow) return;
            
            const windowWidth = sliderWindow.getBoundingClientRect().width;
            const activeCard = cards[currentIndex];
            if (!activeCard) return;
            const cardRect = activeCard.getBoundingClientRect();
            const cardWidth = cardRect.width;

            // Calculate card left position relative to slider container
            const cardLeft = activeCard.offsetLeft;
            
            // Calculate translate to center active card inside window
            currentTranslate = -(cardLeft - (windowWidth / 2 - cardWidth / 2));
            
            // Apply transform smoothly
            slider.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            slider.style.transform = `translateX(${currentTranslate}px)`;
            prevTranslate = currentTranslate;

            // Manage active classes
            cards.forEach((card, idx) => {
                if (idx === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // Manage active dots
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        // Go to Slide by Index
        const goToSlide = (index) => {
            currentIndex = (index + cards.length) % cards.length;
            updateSliderPosition();
        };

        // Arrows Listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        // Dots Listeners
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-index'));
                goToSlide(targetIdx);
            });
        });

        // Initialize Center Position
        setTimeout(updateSliderPosition, 100);
        window.addEventListener('resize', updateSliderPosition);

        // DRAG & SWIPE PHYSICS
        const touchStart = (index) => {
            return function (event) {
                isDragging = true;
                slider.style.transition = 'none';
                startX = getPositionX(event);
                animationID = requestAnimationFrame(animation);
            };
        };

        const touchMove = (event) => {
            if (isDragging) {
                const currentX = getPositionX(event);
                const diff = currentX - startX;
                currentTranslate = prevTranslate + diff;
            }
        };

        const touchEnd = () => {
            if (isDragging) {
                isDragging = false;
                cancelAnimationFrame(animationID);
                
                const movedBy = currentTranslate - prevTranslate;
                
                // Snap threshold (if dragged by more than 80px, switch slide)
                if (movedBy < -80 && currentIndex < cards.length - 1) {
                    currentIndex += 1;
                } else if (movedBy > 80 && currentIndex > 0) {
                    currentIndex -= 1;
                }
                
                updateSliderPosition();
            }
        };

        const getPositionX = (event) => {
            return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        };

        const animation = () => {
            if (isDragging) {
                slider.style.transform = `translateX(${currentTranslate}px)`;
                requestAnimationFrame(animation);
            }
        };

        // Mouse Drag Events
        slider.addEventListener('mousedown', touchStart(currentIndex));
        slider.addEventListener('mousemove', touchMove);
        window.addEventListener('mouseup', touchEnd);
        slider.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });

        // Touch Swipe Events (Mobile/Tablet)
        slider.addEventListener('touchstart', touchStart(currentIndex), { passive: true });
        slider.addEventListener('touchmove', touchMove, { passive: true });
        slider.addEventListener('touchend', touchEnd);
    }

    // ==========================================
    // 5. Scroll Reveal (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -80px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // 6. Kinetic Scroll Parallax & Mouse Flow
    // ==========================================
    const bgGlow = document.querySelector('.bg-glow');
    const bgGridLines = document.querySelector('.bg-grid-lines');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Parallax background grid shift
        if (bgGridLines) {
            bgGridLines.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        
        // Slow rotation and drift of glow spots
        if (bgGlow) {
            bgGlow.style.transform = `translateY(${scrollY * -0.05}px) rotate(${scrollY * 0.015}deg)`;
        }
    });

    if (isDesktop && bgGlow) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.05;
            const y = (e.clientY - window.innerHeight / 2) * 0.05;
            
            // Background glow follows cursor slightly for deep 3D space effect
            bgGlow.style.left = `${x}px`;
            bgGlow.style.top = `${y}px`;
            bgGlow.style.transition = "left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        });
    }

    // ==========================================
    // 7. Interactive Playground Canvas Particles
    // ==========================================
    const canvas = document.getElementById('playground-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Sliders and controls inputs
        const sliderSpeed = document.getElementById('slider-speed');
        const sliderGravity = document.getElementById('slider-gravity');
        const sliderSize = document.getElementById('slider-size');
        
        const valSpeed = document.getElementById('val-speed');
        const valGravity = document.getElementById('val-gravity');
        const valSize = document.getElementById('val-size');

        const colorBtns = document.querySelectorAll('.color-btn');

        // Physical parameters state
        let speedCoeff = parseFloat(sliderSpeed.value);
        let gravityRadius = parseFloat(sliderGravity.value);
        let particleBaseSize = parseFloat(sliderSize.value);
        let activeColorMode = 'rainbow'; // 'cyan', 'platinum', 'purple', 'rainbow'

        // Sliders Listeners
        sliderSpeed.addEventListener('input', (e) => {
            speedCoeff = parseFloat(e.target.value);
            valSpeed.innerText = e.target.value;
        });
        sliderGravity.addEventListener('input', (e) => {
            gravityRadius = parseFloat(e.target.value);
            valGravity.innerText = e.target.value;
        });
        sliderSize.addEventListener('input', (e) => {
            particleBaseSize = parseFloat(e.target.value);
            valSize.innerText = e.target.value;
        });

        // Color Select
        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeColorMode = btn.getAttribute('data-color');
            });
        });

        // Resize Canvas inside container
        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle Class
        class Particle {
            constructor(x, y, isExplosion = false) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * (canvas.height || 300);
                
                // Random angle and speed
                const angle = Math.random() * Math.PI * 2;
                const speed = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 1.5 + 0.5);
                
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.size = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 2 + 1);
                this.alpha = 1;
                this.isExplosion = isExplosion;
                this.decay = Math.random() * 0.02 + 0.01;
                
                // Set HSL for rainbow
                this.hue = Math.random() * 360;
            }

            update(mouse) {
                // Physics base move
                this.x += this.vx * speedCoeff;
                this.y += this.vy * speedCoeff;

                // Mouse interaction (gravity pulling particles)
                if (mouse.x !== null && mouse.y !== null && !this.isExplosion) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < gravityRadius) {
                        // Force increases closer to the mouse
                        const force = (gravityRadius - distance) / gravityRadius;
                        this.x += (dx / distance) * force * 3;
                        this.y += (dy / distance) * force * 3;
                    }
                }

                // Bounce off walls for normal particles, fade out for explosions
                if (this.isExplosion) {
                    this.alpha -= this.decay;
                } else {
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                
                // Determine color
                let particleColor = '#00f2fe';
                if (activeColorMode === 'platinum') {
                    particleColor = '#e2e8f0';
                } else if (activeColorMode === 'purple') {
                    particleColor = '#a855f7';
                } else if (activeColorMode === 'rainbow') {
                    particleColor = `hsl(${this.hue}, 80%, 60%)`;
                    this.hue = (this.hue + 1) % 360;
                }
                
                ctx.fillStyle = particleColor;
                // Add glow to explosion particles
                if (this.isExplosion) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = particleColor;
                }
                
                const finalSize = this.isExplosion ? this.size : (this.size * (particleBaseSize / 2));
                ctx.arc(this.x, this.y, Math.max(0.5, finalSize), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        const particles = [];
        const maxParticles = 80;
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Track Mouse
        const mouse = { x: null, y: null };
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Click Explosion Trigger
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Create explosion particles
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(clickX, clickY, true));
            }
        });

        // Loop Animation
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background grid lines inside playground canvas
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
            ctx.lineWidth = 1;
            for (let i = 40; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let j = 40; j < canvas.height; j += 40) {
                ctx.beginPath();
                ctx.moveTo(0, j);
                ctx.lineTo(canvas.width, j);
                ctx.stroke();
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update(mouse);
                p.draw();
                
                // Delete dead explosion particles
                if (p.isExplosion && p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            // Fill back base particles if any died
            const baseCount = particles.filter(p => !p.isExplosion).length;
            if (baseCount < maxParticles) {
                particles.push(new Particle());
            }

            requestAnimationFrame(animate);
        };
        animate();
    }
});
