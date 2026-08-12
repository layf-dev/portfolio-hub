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

    // Fallback timeout
    const preloaderTimeout = setTimeout(removePreloader, 1500);

    window.addEventListener('load', () => {
        clearTimeout(preloaderTimeout);
        setTimeout(removePreloader, 300);
    });

    // ==========================================
    // 1. Smooth Scroll & Prefill Task
    // ==========================================
    const scrollLinks = document.querySelectorAll('.scroll-to');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            const selectedTask = link.getAttribute('data-task');
            if (selectedTask) {
                const taskTextarea = document.getElementById('contact-task');
                if (taskTextarea) {
                    taskTextarea.value = `Здравствуйте! Меня интересует разработка услуги: "${selectedTask}". \nСфера бизнеса: `;
                    setTimeout(() => {
                        taskTextarea.focus();
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

    const isDesktop = window.matchMedia("(pointer: fine)").matches;

    // ==========================================
    // 2. Interactive 3D Stats Widget (Tilt & Count-Up)
    // ==========================================
    const statsCard = document.getElementById('hero-stats-card');
    const statsWidget = document.querySelector('.hero-stats-widget');
    const statTiles = document.querySelectorAll('.stat-tile');

    if (statsCard && statsWidget) {
        // 3D Tilt Effect
        statsCard.addEventListener('mousemove', (e) => {
            const rect = statsCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rx = -(y - rect.height / 2) / 12;
            const ry = (x - rect.width / 2) / 12;
            
            statsWidget.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        statsCard.addEventListener('mouseleave', () => {
            statsWidget.style.transform = 'rotateX(0deg) rotateY(0deg)';
            statsWidget.style.transition = 'transform 0.5s ease-out';
        });

        statsCard.addEventListener('mouseenter', () => {
            statsWidget.style.transition = 'none';
        });

        // Count-Up Animation Engine
        const animateValue = (obj, start, end, duration, prefix = '', suffix = '') => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                
                const easeProgress = progress * (2 - progress);
                let current = start + easeProgress * (end - start);
                
                if (end % 1 !== 0) {
                    obj.innerHTML = prefix + current.toFixed(1) + suffix;
                } else {
                    obj.innerHTML = prefix + Math.floor(current) + suffix;
                }
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        // Trigger Count-Up
        const triggerCountUp = () => {
            statTiles.forEach(tile => {
                const numEl = tile.querySelector('.stat-num');
                const targetVal = parseFloat(tile.getAttribute('data-value'));
                const prefix = tile.getAttribute('data-prefix') || '';
                const suffix = tile.getAttribute('data-suffix') || '';
                
                setTimeout(() => {
                    animateValue(numEl, 0, targetVal, 1500, prefix, suffix);
                }, 400);
            });
        };

        window.addEventListener('load', triggerCountUp);
        if (document.readyState === 'complete') {
            setTimeout(triggerCountUp, 1000);
        }
    }

    // ==========================================
    // 3. Interactive Portfolio Grid Filtering
    // ==========================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const gridCards = document.querySelectorAll('.project-grid-card');

    if (filterTabs.length > 0 && gridCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const selectedCategory = tab.getAttribute('data-category');

                gridCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.classList.remove('is-filtered-out');
                        card.style.display = 'flex';
                    } else {
                        card.classList.add('is-filtered-out');
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // 4. Scroll Reveal (IntersectionObserver)
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
    // 5. Kinetic Scroll Parallax & Watermark Scroll
    // ==========================================
    const bgGlow = document.querySelector('.bg-glow');
    const bgGridLines = document.querySelector('.bg-grid-lines');
    const bgWatermark = document.querySelector('.bg-watermark');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Grid lines parallax
        if (bgGridLines) {
            bgGridLines.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        
        // Glow spot movement
        if (bgGlow) {
            bgGlow.style.transform = `translateY(${scrollY * -0.05}px) rotate(${scrollY * 0.015}deg)`;
        }

        // Horizontal Watermark scrolling text (Apple style)
        if (bgWatermark) {
            bgWatermark.style.transform = `translateX(${scrollY * -0.2}px)`;
        }

        // Split heading scrolling effect
        const splitLefts = document.querySelectorAll('.split-left');
        const splitRights = document.querySelectorAll('.split-right');
        splitLefts.forEach(el => {
            el.style.transform = `translateX(-${scrollY * 0.18}px)`;
        });
        splitRights.forEach(el => {
            el.style.transform = `translateX(${scrollY * 0.18}px)`;
        });
    });

    if (isDesktop) {
        // Glow spot movement following cursor
        if (bgGlow) {
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX - window.innerWidth / 2) * 0.05;
                const y = (e.clientY - window.innerHeight / 2) * 0.05;
                bgGlow.style.left = `${x}px`;
                bgGlow.style.top = `${y}px`;
                bgGlow.style.transition = "left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            });
        }

        // Magnetic Buttons Logic
        const magneticBtns = document.querySelectorAll('.btn-main, .btn-outline-action, .btn-panel-action, .btn-submit-v2, .slider-arrow');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // ==========================================
    // 6. Interactive Playground Canvas Particles
    // ==========================================
    const canvas = document.getElementById('playground-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        const sliderSpeed = document.getElementById('slider-speed');
        const sliderGravity = document.getElementById('slider-gravity');
        const sliderSize = document.getElementById('slider-size');
        
        const valSpeed = document.getElementById('val-speed');
        const valGravity = document.getElementById('val-gravity');
        const valSize = document.getElementById('val-size');

        const colorBtns = document.querySelectorAll('.color-btn-v2');

        let speedCoeff = parseFloat(sliderSpeed.value);
        let gravityRadius = parseFloat(sliderGravity.value);
        let particleBaseSize = parseFloat(sliderSize.value);
        let activeColorMode = 'rainbow';

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

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeColorMode = btn.getAttribute('data-color');
            });
        });

        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, isExplosion = false) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * (canvas.height || 300);
                
                const angle = Math.random() * Math.PI * 2;
                const speed = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 1.5 + 0.5);
                
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.size = isExplosion ? (Math.random() * 4 + 2) : (Math.random() * 2 + 1);
                this.alpha = 1;
                this.isExplosion = isExplosion;
                this.decay = Math.random() * 0.02 + 0.01;
                this.hue = Math.random() * 360;
            }

            update(mouse) {
                this.x += this.vx * speedCoeff;
                this.y += this.vy * speedCoeff;

                if (mouse.x !== null && mouse.y !== null && !this.isExplosion) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < gravityRadius) {
                        const force = (gravityRadius - distance) / gravityRadius;
                        this.x += (dx / distance) * force * 3;
                        this.y += (dy / distance) * force * 3;
                    }
                }

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

        const particles = [];
        const maxParticles = 80;
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

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

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(clickX, clickY, true));
            }
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.007)';
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
                
                if (p.isExplosion && p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            const baseCount = particles.filter(p => !p.isExplosion).length;
            if (baseCount < maxParticles) {
                particles.push(new Particle());
            }

            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================
    // 6b. Service Panels Hover/Click State Manager
    // ==========================================
    const servicePanels = document.querySelectorAll('.service-panel');
    if (servicePanels.length > 0) {
        servicePanels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                servicePanels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');
            });
            panel.addEventListener('click', () => {
                servicePanels.forEach(p => p.classList.remove('active'));
                panel.classList.add('active');
            });
        });
    }

    // ==========================================
    // 7. Universal Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('universal-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formSuccessMsg = contactForm.querySelector('.form-success-msg');
            const nameInput = document.getElementById('contact-name');
            const linkInput = document.getElementById('contact-link');
            const taskTextarea = document.getElementById('contact-task');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Отправка...';
            }
            
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerText = 'Успешно отправлено!';
                    submitBtn.style.background = '#10b981';
                }
                
                if (formSuccessMsg) {
                    const userName = nameInput ? nameInput.value : 'Пользователь';
                    formSuccessMsg.innerText = `Спасибо, ${userName}! Мы получили ваш запрос и свяжемся с вами в течение пары часов.`;
                    formSuccessMsg.style.display = 'block';
                }
            }, 1200);
        });
    }
});
