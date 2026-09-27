document.addEventListener('DOMContentLoaded', () => {
    // LOADER
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => { setTimeout(() => loader.classList.add('hidden'), 800); });
    setTimeout(() => loader.classList.add('hidden'), 2500);

    // PARTICLES
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x += dx * 0.005;
                    this.y += dy * 0.005;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 152, 0, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 152, 0, ${0.05 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    // NAVBAR
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinksArr = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
        });
        navLinksArr.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { navLinks.classList.remove('active'); navToggle.classList.remove('active'); });
    });

    // COUNTERS
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    animateCounter(num, target);
                });
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    counterObserver.observe(document.querySelector('.hero-stats'));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { el.textContent = target; clearInterval(timer); return; }
            el.textContent = Math.floor(current);
        }, 30);
    }

    // SCROLL ANIMATIONS
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-card')) entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card, .project-card, .timeline-card, .about-card').forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.about-p, .tag').forEach(el => { el.classList.add('fade-left'); observer.observe(el); });
    document.querySelectorAll('.contact-info, .contact-card').forEach(el => { el.classList.add('fade-left'); observer.observe(el); });
    document.querySelectorAll('.contact-form').forEach(el => { el.classList.add('fade-right'); observer.observe(el); });

    // CONTACT FORM
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) { showMessage('Please fill in all fields.', 'error'); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { showMessage('Please enter a valid email address.', 'error'); return; }

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        setTimeout(() => {
            btnText.style.display = '';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            showMessage('Message sent successfully! Ill get back to you soon.', 'success');
            contactForm.reset();
        }, 1500);
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message show ${type}`;
        setTimeout(() => { formMessage.className = 'form-message'; }, 5000);
    }

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // DOWNLOAD BUTTON
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Download Started';
            setTimeout(() => { downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume'; }, 2000);
        });
    }
    const downloadNavBtn = document.getElementById('downloadNavBtn');
    if (downloadNavBtn) {
        downloadNavBtn.addEventListener('click', () => {
            downloadNavBtn.innerHTML = '<i class="fas fa-check"></i> Downloading';
            setTimeout(() => { downloadNavBtn.innerHTML = '<i class="fas fa-download"></i> Resume'; }, 2000);
        });
    }
});
