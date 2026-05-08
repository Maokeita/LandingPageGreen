document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("site-nav");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = Array.from(document.querySelectorAll(".mobile-link"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = Array.from(document.querySelectorAll("header[id], main section[id]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

    const toggleMenu = (open) => {
        if (!menuToggle || !mobileMenu) return;
        const shouldOpen = typeof open === "boolean" ? open : mobileMenu.classList.contains("hidden");
        mobileMenu.classList.toggle("hidden", !shouldOpen);
        menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => toggleMenu());
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => toggleMenu(false));
        });
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                toggleMenu(false);
            }
        });
    }

    const updateNavStyle = () => {
        if (!nav) return;
        nav.classList.toggle("is-scrolled", window.scrollY > 14);
    };

    const updateActiveLink = () => {
        if (!sections.length || !navLinks.length) return;
        const currentOffset = window.scrollY + (nav ? nav.offsetHeight : 64) + 90;
        let currentId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= currentOffset) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("is-active", target === currentId);
        });
    };

    let rafScheduled = false;
    const onScroll = () => {
        if (rafScheduled) return;
        rafScheduled = true;
        window.requestAnimationFrame(() => {
            updateNavStyle();
            updateActiveLink();
            rafScheduled = false;
        });
    };

    updateNavStyle();
    updateActiveLink();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -10% 0px"
            }
        );
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
});
