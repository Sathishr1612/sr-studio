// SR Studio — small, dependency-free interactions
(function () {
    'use strict';

    const header = document.getElementById('siteHeader');
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('menuToggle');

    // ----------------------------------------
    // Header: compact + blurred once scrolled
    // ----------------------------------------
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ----------------------------------------
    // Mobile menu
    // ----------------------------------------
    const setMenu = (open) => {
        header.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('menu-open')) {
            setMenu(false);
            toggle.focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900) setMenu(false);
    });

    // ----------------------------------------
    // Active nav link for the section in view
    // ----------------------------------------
    const navLinks = Array.from(nav.querySelectorAll('a'));
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((section) => navObserver.observe(section));
    }

    // ----------------------------------------
    // Gentle reveal on scroll
    // ----------------------------------------
    const revealItems = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        // Stagger siblings slightly so grids don't pop in all at once
        revealItems.forEach((el) => {
            const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
            const index = siblings.indexOf(el);
            if (index > 0) el.style.transitionDelay = Math.min(index, 4) * 60 + 'ms';
            revealObserver.observe(el);
        });
    } else {
        revealItems.forEach((el) => el.classList.add('is-visible'));
    }

    // Remove stagger delay after reveal so hover effects respond instantly
    document.addEventListener('transitionend', (e) => {
        if (e.target.classList && e.target.classList.contains('is-visible') && e.propertyName === 'opacity') {
            e.target.style.transitionDelay = '';
        }
    });

    // ----------------------------------------
    // Enquiry form → opens the visitor's email app, pre-filled
    // ----------------------------------------
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    const STUDIO_EMAIL = 'rrsathish65@gmail.com';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fields = {
            name: form.elements.name,
            email: form.elements.email,
            message: form.elements.message
        };

        let firstInvalid = null;
        Object.values(fields).forEach((input) => {
            const valid = input.checkValidity() && input.value.trim() !== '';
            input.closest('.field').classList.toggle('has-error', !valid);
            if (!valid && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            note.textContent = 'Please add your name, a valid email and a short message.';
            note.className = 'form-note is-error';
            firstInvalid.focus();
            return;
        }

        const name = fields.name.value.trim();
        const need = form.elements.need.value;
        const phone = form.elements.phone.value.trim();

        const subject = `New project enquiry: ${need} (${name})`;
        const body = [
            `Name: ${name}`,
            `Email: ${fields.email.value.trim()}`,
            phone ? `Phone: ${phone}` : null,
            `Looking for: ${need}`,
            '',
            fields.message.value.trim()
        ].filter((line) => line !== null).join('\n');

        window.location.href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        note.innerHTML = `Thanks, ${name.replace(/[<>&"]/g, '')}! Your email app should open with the message ready to send. ` +
            `If it doesn't, email us at <a href="mailto:${STUDIO_EMAIL}">${STUDIO_EMAIL}</a>.`;
        note.className = 'form-note is-success';
    });

    form.addEventListener('input', (e) => {
        const field = e.target.closest('.field');
        if (field) field.classList.remove('has-error');
    });

    // ----------------------------------------
    // Footer year
    // ----------------------------------------
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
