// SR Studio — small, dependency-free interactions
(function () {
    'use strict';

    const root = document.documentElement;
    const header = document.getElementById('siteHeader');
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----------------------------------------
    // Hero entrance
    // ----------------------------------------
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

    // ----------------------------------------
    // Header: cream + blur once scrolled
    // ----------------------------------------
    const waFloat = document.getElementById('waFloat');
    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        if (waFloat) {
            // show after the hero; hide near the footer where WhatsApp is already listed
            const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 320;
            waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !nearEnd);
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ----------------------------------------
    // Soft scroll (Lenis): eased mouse-wheel / trackpad scrolling.
    // Touch devices keep their native scroll; skipped for reduced motion
    // or if the CDN script didn't load.
    // ----------------------------------------
    let lenis = null;

    if (window.Lenis && !reduceMotion) {
        lenis = new window.Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        // in-page links (#work, #contact…) glide to their section, clear of the fixed header
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            const id = link.getAttribute('href');
            const target = id.length > 1 && document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            lenis.start();
            lenis.scrollTo(target, { offset: -(header.offsetHeight + 16) });
            history.pushState(null, '', id);
        });
    }

    // ----------------------------------------
    // Mobile menu
    // ----------------------------------------
    let menuTimer;

    const setMenu = (open) => {
        clearTimeout(menuTimer);
        menuBtn.setAttribute('aria-expanded', String(open));
        header.classList.toggle('menu-open', open);
        document.body.classList.toggle('menu-locked', open);
        if (lenis) open ? lenis.stop() : lenis.start();

        if (open) {
            menu.hidden = false;
            requestAnimationFrame(() => menu.classList.add('is-open'));
        } else {
            menu.classList.remove('is-open');
            menuTimer = setTimeout(() => { menu.hidden = true; }, reduceMotion ? 0 : 400);
        }
    };

    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuBtn.focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900 && !menu.hidden) setMenu(false);
    });

    // ----------------------------------------
    // Active nav link
    // ----------------------------------------
    const navLinks = Array.from(document.querySelectorAll('.nav a'));

    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        navLinks.forEach((link) => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) navObserver.observe(section);
        });
        // hero has no nav link: observing it clears the active state at the top
        const hero = document.getElementById('top');
        if (hero) navObserver.observe(hero);
    }

    // ----------------------------------------
    // Reveal on scroll (text + images)
    // ----------------------------------------
    const revealEls = document.querySelectorAll('.reveal, .img-reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

        revealEls.forEach((el) => {
            // light stagger for items in the same list
            const parent = el.parentElement;
            if (parent && (parent.matches('.why-list, .service-list, .stages'))) {
                const index = Array.prototype.indexOf.call(parent.children, el);
                el.style.transitionDelay = Math.min(index, 4) * 70 + 'ms';
            }
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach((el) => el.classList.add('is-in'));
    }

    // ----------------------------------------
    // Services → pre-select project type in the form
    // ----------------------------------------
    const needSelect = document.getElementById('need');

    document.querySelectorAll('[data-need]').forEach((link) => {
        link.addEventListener('click', () => {
            const value = link.dataset.need;
            Array.from(needSelect.options).forEach((opt) => {
                if (opt.value === value || opt.text === value) needSelect.value = opt.value;
            });
        });
    });

    // ----------------------------------------
    // Contact form → opens the visitor's email app, pre-filled
    // ----------------------------------------
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    const STUDIO_EMAIL = 'rrsathish65@gmail.com';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const required = [form.elements.name, form.elements.email, form.elements.message];
        let firstInvalid = null;

        required.forEach((input) => {
            const valid = input.value.trim() !== '' && input.checkValidity();
            input.closest('.field').classList.toggle('has-error', !valid);
            if (!valid && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            note.textContent = 'Please add your name, a valid email and a short message.';
            note.className = 'form-note is-error';
            firstInvalid.focus();
            return;
        }

        const name = form.elements.name.value.trim();
        const phone = form.elements.phone.value.trim();
        const need = form.elements.need.value;

        const subject = `Project enquiry: ${need} (${name})`;
        const body = [
            `Name: ${name}`,
            `Email: ${form.elements.email.value.trim()}`,
            phone ? `Phone: ${phone}` : null,
            `Project type: ${need}`,
            '',
            form.elements.message.value.trim()
        ].filter((line) => line !== null).join('\n');

        window.location.href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        note.textContent = '';
        note.append(
            `Thank you, ${name}. Your email app should open with the message ready to send. If it doesn't, write to `
        );
        const mail = document.createElement('a');
        mail.href = `mailto:${STUDIO_EMAIL}`;
        mail.textContent = STUDIO_EMAIL;
        note.append(mail, '.');
        note.className = 'form-note is-success';
    });

    form.addEventListener('input', (e) => {
        const field = e.target.closest('.field');
        if (field) field.classList.remove('has-error');
    });
})();
