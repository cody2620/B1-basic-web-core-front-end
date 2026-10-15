// 브라우저의 자동 스크롤 복원 비활성화: 새로고침 시 항상 맨 위에서 시작
history.scrollRestoration = 'manual';

import { STATE } from './state.js';
import './contact.js';
import './projects.js';

// ===== 1. 다크모드 토글 =====
const themeToggle = document.querySelector('.theme-toggle');

const renderTheme = (animate = false) => {
    const theme = STATE.theme;

    if (animate) {
        themeToggle.classList.add('is-rotating');
        themeToggle.addEventListener('animationend', () => {
            themeToggle.classList.remove('is-rotating');
        }, { once: true });
    }

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
};

renderTheme(false);

themeToggle.addEventListener('click', () => {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', STATE.theme);
    renderTheme(true);
});

themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        STATE.theme = e.matches ? 'dark' : 'light';
        renderTheme(false);
    }
});


// ===== 2. 햄버거 메뉴 =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
};

hamburger.addEventListener('click', toggleMenu);

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});


// ===== 3. 부드러운 스크롤 =====
const navLinks = document.querySelectorAll('.nav-link');

const handleNavLinkClick = (event) => {
    const link = event.currentTarget;
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: 'smooth' });
    navMenu.classList.remove('active');
};

navLinks.forEach((link) => {
    link.addEventListener('click', handleNavLinkClick);
});

const ctaEmoji = document.querySelector('a.emoji');
if (ctaEmoji) {
    ctaEmoji.addEventListener('click', handleNavLinkClick);
}


// ===== 4. 스크롤에 따른 헤더 스타일 변경 + 스크롤 탑 버튼 =====
const header = document.querySelector('.header');
const scrollTopBtn = document.querySelector('.scroll-top');

const HEADER_SCROLL_THRESHOLD = 60;
const SCROLL_TOP_THRESHOLD = 300;

window.addEventListener('scroll', () => {
    const { scrollY } = window;
    header.classList.toggle('scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
    scrollTopBtn.classList.toggle('visible', scrollY > SCROLL_TOP_THRESHOLD);
});

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

scrollTopBtn.addEventListener('click', scrollToTop);

scrollTopBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
    }
});


// ===== 5. 스크롤 등장 애니메이션 (Intersection Observer) =====
const revealSections = document.querySelectorAll('main section');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

revealSections.forEach((section) => revealObserver.observe(section));


// ===== 6. 타이핑 효과 =====
const initTypewriterEffect = (onComplete) => {
    const heroTitle = document.querySelector('#hero h2');
    if (!heroTitle) return;

    const heroSub = document.querySelector('#hero p');
    if (heroSub) heroSub.style.opacity = '0';

    const fullText = heroTitle.textContent;
    let currentText = '';

    heroTitle.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    const textEl   = heroTitle.querySelector('.typewriter-text');
    const cursorEl = heroTitle.querySelector('.typewriter-cursor');

    const typeNextCharacter = () => {
        if (currentText.length < fullText.length) {
            currentText += fullText[currentText.length];
            textEl.textContent = currentText;
            setTimeout(typeNextCharacter, 140);
        } else {
            cursorEl.classList.add('typewriter-cursor--done');
            cursorEl.addEventListener('animationend', () => {
                cursorEl.classList.add('typewriter-cursor--hidden');
                onComplete && onComplete();
            }, { once: true });
        }
    };

    typeNextCharacter();
};


// ===== 7. p 태그 물결 애니메이션 =====
const initWaveText = () => {
    const heroSub = document.querySelector('#hero p');
    if (!heroSub) return;

    const text = heroSub.textContent;
    heroSub.innerHTML = '';

    text.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'wave-char';
        span.textContent = ch === ' ' ? ' ' : ch;
        span.style.setProperty('--i', i);
        heroSub.appendChild(span);
    });

    heroSub.classList.add('wave-text-visible');
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTypewriterEffect(initWaveText);
    });
} else {
    initTypewriterEffect(initWaveText);
}
