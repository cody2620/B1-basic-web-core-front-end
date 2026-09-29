/* ========================================
   중앙 상태 객체 (STATE)

   앱 전체 상태를 한 곳에서 관리합니다.
   흐름: 사용자 이벤트 → STATE 변경 → 렌더링 함수 호출 → 화면 업데이트

   - theme: 현재 테마 ('light' | 'dark')
   - projects: GitHub API 프로젝트 목록 상태
     * state: 'loading' | 'error' | 'empty' | 'success'
     * data: 프로젝트 배열
   - form: 폼 입력 상태 및 에러
     * errors: { name: string, email: string, message: string }
   ======================================== */
// 초기 테마 결정: 저장된 설정 → OS 선호도 → 기본값 'light'
const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // 사용자의 OS 다크모드 선호도 감지
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

const STATE = {
    // 테마: 3단계 우선순위
    // 1순위: localStorage 저장 설정 (사용자 선택 존중)
    // 2순위: 시스템 색상 선호도 (prefers-color-scheme)
    // 3순위: 기본값 'light'
    theme: getInitialTheme(),
    projects: {
        state: 'loading', // 초기 상태: 페이지 로드 시 GitHub API 요청 중
        data: []
    },
    form: {
        errors: {
            name: '',
            email: '',
            message: ''
        }
    }
};

// ===== 1. 다크모드 토글 =====
const themeToggle = document.querySelector('.theme-toggle');

// 상태 -> 렌더링: STATE의 theme 값을 받아 실제 화면(html data-theme, 버튼 아이콘)에 반영
const renderTheme = (animate = false) => {
    const theme = STATE.theme;

    // 테마 변경 애니메이션: 버튼에 회전 효과 추가
    if (animate) {
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    }

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
};

// 페이지 로드 시 저장된 테마 적용 (애니메이션 없음)
renderTheme(false);

// 토글 버튼에 transition 스타일 추가 (부드러운 회전)
themeToggle.style.transition = 'transform 0.3s ease';

themeToggle.addEventListener('click', () => {
    // 사용자 이벤트 -> 상태 변경 -> 화면 업데이트 (애니메이션 포함)
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', STATE.theme);
    renderTheme(true);
});

// 키보드 접근성: Enter/Space 키로도 테마 토글 가능 (click 이벤트와 동일)
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});

// 시스템 다크모드 설정 변경 감지
// 사용자가 OS에서 다크모드를 켜거나 끄면 자동으로 테마 전환
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // localStorage에 저장된 선택이 없는 경우만 자동 변경
    // (사용자가 명시적으로 설정한 테마 선호도는 존중)
    if (!localStorage.getItem('theme')) {
        STATE.theme = e.matches ? 'dark' : 'light';
        renderTheme(false);
    }
});


// ===== 2. 햄버거 메뉴 =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// 메뉴 토글 헬퍼 함수 (반복되는 로직 추출)
const toggleMenu = () => {
    navMenu.classList.toggle('open');
};

hamburger.addEventListener('click', toggleMenu);

// 키보드 접근성: Enter/Space 키로도 메뉴 토글 가능
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});


// ===== 3. 부드러운 스크롤 (네비게이션 메뉴 클릭) =====
const navLinks = document.querySelectorAll('.nav-link');

// 네비게이션 링크 클릭 시 동작하는 핸들러 (반복되는 로직 추출)
const handleNavLinkClick = (event) => {
    const link = event.currentTarget;
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (!targetSection) return;

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: 'smooth' });
    navMenu.classList.remove('open'); // 모바일: 메뉴 자동 닫기
};

navLinks.forEach((link) => {
    link.addEventListener('click', handleNavLinkClick);
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

// 스크롤탑 동작 헬퍼 함수 (반복되는 로직 추출)
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

scrollTopBtn.addEventListener('click', scrollToTop);

// 키보드 접근성: Enter/Space 키로도 맨 위로 스크롤 가능
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
            // 상태(뷰포트 교차 여부) -> 렌더링(in-view 클래스) 흐름
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target); // 한 번 나타나면 관찰 종료
            }
        });
    },
    { threshold: 0.2 } // README에 명시: 임계값 0.2
);

// forEach: 각 섹션을 Intersection Observer로 관찰 시작
revealSections.forEach((section) => revealObserver.observe(section));


// ===== 6. Contact 폼 (검증 + 서버 전송) =====
const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submitBtn = document.querySelector('#submit-btn');
const formLoading = document.querySelector('.form-loading');
const formSuccess = document.querySelector('.form-success');
const formError = document.querySelector('.form-error');
const errorReason = document.querySelector('.error-reason');
const retryBtn = document.querySelector('#retry-btn');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formInputs = [nameInput, emailInput, messageInput];

// STATE에 폼 전송 상태 추가
STATE.form.status = 'idle'; // idle | loading | success | error
STATE.form.lastSubmitData = null; // 재시도를 위해 마지막 제출 데이터 저장

// 필드 하나의 유효성을 검증하고 STATE.form.errors 업데이트
const validateField = (input) => {
    const { id, value } = input;
    const trimmedValue = value.trim();
    let errorText = '';

    if (!trimmedValue) {
        errorText = '필수 입력 항목입니다.';
    } else if (id === 'email' && !EMAIL_REGEX.test(trimmedValue)) {
        errorText = '올바른 이메일 형식이 아닙니다.';
    }

    STATE.form.errors[id] = errorText;
    return errorText === '';
};

// 상태 -> 렌더링: 폼 입력 필드 에러 표시
const renderFormErrors = () => {
    formInputs.forEach((input) => {
        const errorEl = input.nextElementSibling;
        const errorText = STATE.form.errors[input.id];
        errorEl.textContent = errorText || '';
    });
};

// 상태 -> 렌더링: 폼 전송 상태 표시 (로딩/성공/실패)
const renderFormStatus = () => {
    const status = STATE.form.status;
    const isSubmitting = status === 'loading';

    // 상태별 메시지 표시
    formLoading.hidden = status !== 'loading';
    formSuccess.hidden = status !== 'success';
    formError.hidden = status !== 'error';

    // 제출 중에는 버튼과 입력 필드 비활성화
    submitBtn.disabled = isSubmitting;
    formInputs.forEach(input => input.disabled = isSubmitting);
};

// 폼 입력 필드의 'input' 이벤트 리스너
formInputs.forEach((input) => {
    input.addEventListener('input', () => {
        validateField(input);
        renderFormErrors();
    });
});

// HTTP 상태코드별 사용자 친화적 에러 메시지
const HTTP_ERROR_MESSAGES = {
    400: '요청이 잘못되었습니다. 입력 내용을 다시 확인해주세요.',
    401: '인증이 필요합니다. 로그인 후 다시 시도해주세요.',
    403: '요청할 수 없습니다. 권한이 없거나 사이트 설정 문제입니다.',
    404: '서버를 찾을 수 없습니다. 나중에 다시 시도해주세요.',
    429: '요청이 너무 많습니다. 30초 후 다시 시도해주세요.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    502: '서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.',
    503: '서버가 현재 사용 불가능합니다. 잠시 후 다시 시도해주세요.',
};

// 폼 데이터를 서버로 전송하는 비동기 함수
const submitForm = async (formData) => {
    const timeoutMs = 5000; // 5초 타임아웃

    try {
        // AbortController로 타임아웃 처리
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const status = response.status;
            const errorMessage = HTTP_ERROR_MESSAGES[status] || `서버 오류 (상태 코드: ${status})`;
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        // 타임아웃 처리
        if (error.name === 'AbortError') {
            throw new Error('요청 시간 초과 (5초). 인터넷 연결을 확인해주세요.');
        }
        // TypeError: fetch 실패 (네트워크 오류)
        if (error instanceof TypeError) {
            throw new Error('네트워크 오류: 인터넷 연결을 확인해주세요.');
        }
        throw error;
    }
};

// 폼 제출 이벤트
contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1단계: 필드 검증
    const isAllValid = formInputs
        .map((input) => validateField(input))
        .every((valid) => valid);

    renderFormErrors();

    if (!isAllValid) {
        const firstInvalidField = formInputs.find((input) => STATE.form.errors[input.id]);
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return;
    }

    // 2단계: 로딩 상태 표시
    STATE.form.status = 'loading';
    renderFormStatus();

    // 3단계: 폼 데이터 생성 및 저장 (재시도용)
    const formData = new FormData(contactForm);
    STATE.form.lastSubmitData = formData;

    try {
        // 4단계: 서버 전송
        await submitForm(formData);

        // 5단계: 성공
        STATE.form.status = 'success';
        renderFormStatus();
        contactForm.reset();
        STATE.form.errors = { name: '', email: '', message: '' };
        renderFormErrors();

        // 5초 후 자동으로 성공 메시지 숨김
        setTimeout(() => {
            STATE.form.status = 'idle';
            renderFormStatus();
        }, 5000);

    } catch (error) {
        // 실패: 에러 메시지와 함께 상태 변경
        STATE.form.status = 'error';
        errorReason.textContent = error.message;
        renderFormStatus();
    }
});

// 재시도 버튼
retryBtn.addEventListener('click', () => {
    if (STATE.form.lastSubmitData) {
        contactForm.dispatchEvent(new Event('submit'));
    }
});


// ===== 7. GitHub API 연동 (Projects 섹션) =====
// ⚠️ [깃허브 아이디 입력 필요] 'octocat' 자리를 본인 GitHub 아이디로 바꿔주세요.
const GITHUB_USERNAME = 'octocat';
const projectsContainer = document.querySelector('#projects-container');

// 상태 -> 렌더링: STATE.projects의 상태에 따라 Projects 섹션을 다시 그림
const renderProjects = () => {
    const { state, data } = STATE.projects;

    if (state === 'loading') {
        projectsContainer.innerHTML = `<p class="projects-status">로딩 중...</p>`;
        return;
    }

    if (state === 'error') {
        projectsContainer.innerHTML = `
            <div class="projects-status">
                <p>프로젝트를 불러올 수 없습니다. (상태 코드: 오류 발생)</p>
                <p style="font-size: 0.9rem; color: var(--color-text-sub); margin-top: 8px;">잠시 후 다시 시도해주세요.</p>
                <button id="retry-btn" type="button" style="margin-top: 12px; padding: 8px 16px; background-color: var(--color-primary); color: white; border-radius: 4px; cursor: pointer;">다시 시도</button>
            </div>
        `;
        document.querySelector('#retry-btn').addEventListener('click', loadProjects);
        return;
    }

    if (state === 'empty') {
        projectsContainer.innerHTML = `<p class="projects-status">표시할 프로젝트가 없습니다.</p>`;
        return;
    }

    // state === 'success': GitHub 저장소 데이터를 HTML 카드로 변환
    // map: 각 repo 객체를 HTML 문자열로 변환
    // join: 배열의 HTML 문자열들을 하나의 문자열로 연결
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

// fetch + async/await로 GitHub repos 호출, 최대 2회 재시도
async function loadProjects() {
    STATE.projects.state = 'loading';
    renderProjects();

    const maxRetries = 2;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

            if (!response.ok) {
                throw new Error(`GitHub API 오류: ${response.status}`);
            }

            const repos = await response.json();

            // filter: repo.fork가 false인 저장소만 선택 (포크된 저장소 제외)
            const ownRepos = repos.filter((repo) => !repo.fork);

            STATE.projects.state = ownRepos.length === 0 ? 'empty' : 'success';
            STATE.projects.data = ownRepos;
            renderProjects();
            return;
        } catch (error) {
            attempt++;
            console.error(`시도 ${attempt}/${maxRetries} 실패:`, error);

            if (attempt >= maxRetries) {
                STATE.projects.state = 'error';
                STATE.projects.data = [];
                renderProjects();
                return;
            }

            // 다음 재시도 전 500ms 대기
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }
}

loadProjects();