// ===== 1. 다크모드 토글 =====
const themeToggle = document.querySelector('.theme-toggle');

// 상태 -> 렌더링: 테마 값을 받아 실제 화면(html data-theme, 버튼 아이콘)에 반영
const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
};

// 페이지 로드 시 저장된 테마 복원 (없으면 라이트 모드)
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    // 사용자 이벤트 -> 상태 변경(로컬스토리지) -> 화면 업데이트
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
});


// ===== 2. 햄버거 메뉴 =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});


// ===== 3. 부드러운 스크롤 (네비게이션 메뉴 클릭) =====
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href'); // 예: "#about"
        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        event.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });

        // 모바일에서 메뉴 클릭 시 메뉴 닫기
        navMenu.classList.remove('open');
    });
});


// ===== 4. 스크롤에 따른 헤더 스타일 변경 + 스크롤 탑 버튼 =====
const header = document.querySelector('.header');
const scrollTopBtn = document.querySelector('.scroll-top');

// 기준값 (README에 명시된 값과 동일하게 유지)
const HEADER_SCROLL_THRESHOLD = 60;   // 헤더 배경 변경 기준
const SCROLL_TOP_THRESHOLD = 300;     // 스크롤 탑 버튼 노출 기준

window.addEventListener('scroll', () => {
    const { scrollY } = window;

    // 사용자 스크롤 이벤트 -> 상태(스크롤 위치) 변경 -> 헤더/버튼 화면 업데이트
    header.classList.toggle('scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
    scrollTopBtn.classList.toggle('visible', scrollY > SCROLL_TOP_THRESHOLD);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== 5. 스크롤 등장 애니메이션 (Intersection Observer) =====
const revealSections = document.querySelectorAll('main section');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            // 상태(뷰포트 교차 여부) -> 렌더링(in-view 클래스) 흐름
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target); // 한 번 나타나면 관찰 종료
            }
        });
    },
    { threshold: 0.2 } // README에 명시: 임계값 0.2
);

revealSections.forEach((section) => revealObserver.observe(section));


// ===== 6. Contact 폼 유효성 검사 =====
const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const formSuccess = document.querySelector('.form-success');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 필드 하나의 유효성 상태를 계산해 에러 메시지로 렌더링
const validateField = (input) => {
    const { id, value } = input;
    const trimmedValue = value.trim();
    const errorEl = input.nextElementSibling; // <span class="error-message">

    let errorText = '';

    if (!trimmedValue) {
        errorText = '필수 입력 항목입니다.';
    } else if (id === 'email' && !EMAIL_REGEX.test(trimmedValue)) {
        errorText = '올바른 이메일 형식이 아닙니다.';
    }

    // 상태(에러 유무) -> 렌더링(에러 메시지 표시/숨김)
    errorEl.textContent = errorText;

    return errorText === '';
};

// 입력할 때마다 실시간으로 해당 필드만 재검증
[nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => validateField(input));
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = [nameInput, emailInput, messageInput];
    const isAllValid = fields
        .map((input) => validateField(input)) // 각 필드 검증 -> 유효 여부 배열
        .every((valid) => valid);              // 전부 true여야 통과

    if (!isAllValid) {
        formSuccess.hidden = true;
        return;
    }

    // 성공 상태 렌더링
    formSuccess.hidden = false;
    contactForm.reset();
    fields.forEach((input) => {
        input.nextElementSibling.textContent = '';
    });
});


// ===== 7. GitHub API 연동 (Projects 섹션) =====
// ⚠️ [깃허브 아이디 입력 필요] 'octocat' 자리를 본인 GitHub 아이디로 바꿔주세요.
const GITHUB_USERNAME = 'octocat';
const projectsContainer = document.querySelector('#projects-container');

// 상태에 따라 Projects 컨테이너를 다시 그리는 렌더링 함수
const renderProjectsState = (state, data = []) => {
    if (state === 'loading') {
        projectsContainer.innerHTML = `<p class="projects-status">로딩 중...</p>`;
        return;
    }

    if (state === 'error') {
        projectsContainer.innerHTML = `
            <div class="projects-status">
                <p>프로젝트를 불러올 수 없습니다.</p>
                <button id="retry-btn" type="button">다시 시도</button>
            </div>
        `;
        document
            .querySelector('#retry-btn')
            .addEventListener('click', loadProjects);
        return;
    }

    if (state === 'empty') {
        projectsContainer.innerHTML = `<p class="projects-status">표시할 프로젝트가 없습니다.</p>`;
        return;
    }

    // state === 'success' : repos 배열을 카드 HTML로 변환 (map + 템플릿 리터럴)
    const cardsHTML = data
        .map(({ name, description, html_url, language }) => `
            <article class="project-card">
                <div class="project-content">
                    <h3>${name}</h3>
                    <p>${description ?? '설명이 없는 프로젝트입니다.'}</p>
                    <div class="project-tags">
                        ${language ? `<span class="tag">${language}</span>` : ''}
                    </div>
                    <a href="${html_url}" class="project-link" target="_blank" rel="noopener">GitHub에서 보기 →</a>
                </div>
            </article>
        `)
        .join('');

    projectsContainer.innerHTML = cardsHTML;
};

// fetch + async/await로 GitHub repos 호출
async function loadProjects() {
    renderProjectsState('loading');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

        if (!response.ok) {
            throw new Error(`GitHub API 응답 오류: ${response.status}`);
        }

        const repos = await response.json();

        // 포크 제외 + 최신순 정렬 (filter 활용, 선택 요구사항)
        const ownRepos = repos.filter((repo) => !repo.fork);

        if (ownRepos.length === 0) {
            renderProjectsState('empty');
            return;
        }

        renderProjectsState('success', ownRepos);
    } catch (error) {
        console.error(error);
        renderProjectsState('error');
    }
}

loadProjects();