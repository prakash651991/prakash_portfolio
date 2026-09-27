document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');
    const toggleBtn = document.querySelector('.nav-toggle');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    function toggleMenu() {
        navLinks.classList.toggle('active');
    }

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Contact form handling
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Download resume click tracking
    const downloadBtn = document.getElementById('downloadResume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloading...';
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
            }, 2000);
        });
    }
});
