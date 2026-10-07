document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 1500);
    });
    
    // ========================================
    // AOS ANIMATION INITIALIZATION
    // ========================================
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
        mirror: false
    });
    
    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ========================================
    // SMOOTH SCROLL FOR NAVIGATION LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
    
    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // ========================================
    // TYPEWRITER EFFECT FOR HERO
    // ========================================
    const roles = [
        'Frontend Developer',
        'UI/UX Designer',
        'WordPress Developer'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    
    function typeWriter() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? deletingSpeed : typingSpeed;
        
        if (!isDeleting && charIndex === currentRole.length) {
            speed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        setTimeout(typeWriter, speed);
    }
    
    // Start typewriter after preloader
    setTimeout(typeWriter, 2000);
    
    // ========================================
    // SKILL PROGRESS BAR ANIMATION
    // ========================================
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillProgressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                bar.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateSkillBars);
    window.addEventListener('load', animateSkillBars);
    
    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');
        
        const name = document.getElementById('name').value;
        
        // Add loading state
        btnText.style.display = 'none';
        btnIcon.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(function() {
            btnLoader.style.display = 'none';
            btnText.style.display = 'block';
            btnText.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Show notification
            showNotification('Thank you ' + name + '! Your message has been sent successfully.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(function() {
                btnText.textContent = 'Send Message';
                btnIcon.style.display = 'block';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 2000);
    });
    
    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                        type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                        'linear-gradient(135deg, #6366f1, #8b5cf6)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }
    
    // ========================================
    // PARALLAX EFFECT FOR HERO BACKGROUND
    // ========================================
    const bgGlows = document.querySelectorAll('.bg-glow');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        bgGlows.forEach((glow, index) => {
            const speed = 0.1 + (index * 0.05);
            glow.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // ========================================
    // PROJECT CARD HOVER EFFECTS
    // ========================================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========================================
    // CERTIFICATE CARD EFFECTS
    // ========================================
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.certificate-badge');
            badge.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.certificate-badge');
            badge.style.transform = 'scale(1) rotate(0)';
        });
    });
    
    // ========================================
    // SOFT SKILL ITEM EFFECTS
    // ========================================
    const softSkillItems = document.querySelectorAll('.soft-skill-item');
    
    softSkillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.soft-skill-icon');
            icon.style.background = 'rgba(99, 102, 241, 0.2)';
            icon.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.soft-skill-icon');
            icon.style.background = 'rgba(99, 102, 241, 0.1)';
            icon.style.transform = 'scale(1)';
        });
    });
    
    // ========================================
    // FORM INPUT FOCUS EFFECTS
    // ========================================
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // ========================================
    // MAGNETIC BUTTON EFFECT
    // ========================================
    const magneticBtns = document.querySelectorAll('.btn-primary-main, .btn-secondary-main');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
    
    // ========================================
    // SCROLL REVEAL FOR TIMELINE
    // ========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const revealTimeline = () => {
        timelineItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }
        });
    };
    
    // Set initial state
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease-out';
    });
    
    window.addEventListener('scroll', revealTimeline);
    window.addEventListener('load', revealTimeline);
    
    // ========================================
    // NAVBAR TOGGLE ANIMATION
    // ========================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    navbarToggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    document.addEventListener('keydown', function(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // ========================================
    // PERFORMANCE: PAUSE ANIMATIONS WHEN TAB HIDDEN
    // ========================================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.body.classList.add('animations-paused');
        } else {
            document.body.classList.remove('animations-paused');
        }
    });
    
    // ========================================
    // CONSOLE WELCOME MESSAGE
    // ========================================
    console.log('%c👋 Welcome to Sathish R Portfolio!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cFrontend Developer | UI/UX Designer | WordPress Expert', 'font-size: 14px; color: #818cf8;');
    console.log('%c📧 rrsathish65@gmail.com | 📱 +91 6374363370', 'font-size: 12px; color: #94a3b8;');
    
});

// ========================================
// EXTERNAL LINK HANDLER
// ========================================
function openExternalLink(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// ========================================
// DOWNLOAD RESUME FUNCTION
// ========================================
function downloadResume() {
    const link = document.createElement('a');
    link.href = 'Sathish_R_Resume.docx';
    link.download = 'Sathish_R_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const fills=document.querySelectorAll(".skills-progress");

const obs=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.style.width=e.target.dataset.width+"%";
}
});
},{threshold:.5});

fills.forEach(el=>obs.observe(el));