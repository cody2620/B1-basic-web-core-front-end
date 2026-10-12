import { STATE } from './state.js';

const GITHUB_USERNAME = 'cody2620';
const projectsContainer = document.querySelector('#projects-container');
const filterButtonsContainer = document.querySelector('#filter-buttons-container');

const renderFilterButtons = () => {
    const buttonsHTML = STATE.projects.allLanguages
        .map(lang => `<button class="filter-btn" data-filter="${lang}">${lang}</button>`)
        .join('');

    filterButtonsContainer.innerHTML = buttonsHTML;

    filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
};

const handleFilterChange = (event) => {
    const selectedFilter = event.target.getAttribute('data-filter');
    STATE.projects.selectedFilter = selectedFilter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === selectedFilter);
    });

    renderProjects();
};

const getFilteredProjects = () => {
    const { data, selectedFilter } = STATE.projects;

    if (selectedFilter === 'all') return data;

    return data.filter(project => project.language === selectedFilter);
};

const renderProjects = () => {
    const { state } = STATE.projects;

    if (state === 'loading') {
        projectsContainer.innerHTML = `<p class="projects-status">로딩 중...</p>`;
        return;
    }

    if (state === 'error') {
        projectsContainer.innerHTML = `
            <div class="projects-status">
                <p>프로젝트를 불러올 수 없습니다.</p>
                <p class="projects-error-sub">잠시 후 다시 시도해주세요.</p>
                <button id="projects-retry-btn" type="button" class="projects-retry">다시 시도</button>
            </div>
        `;
        document.querySelector('#projects-retry-btn').addEventListener('click', loadProjects);
        return;
    }

    const filteredData = getFilteredProjects();

    if (filteredData.length === 0) {
        projectsContainer.innerHTML = `<p class="projects-status">표시할 프로젝트가 없습니다.</p>`;
        return;
    }

    const cardsHTML = filteredData
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

const extractLanguages = (projects) => {
    const languages = new Set();
    projects.forEach(project => {
        if (project.language) languages.add(project.language);
    });
    return Array.from(languages).sort();
};

document.querySelector('[data-filter="all"]').addEventListener('click', handleFilterChange);

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
            const ownRepos = repos.filter((repo) => !repo.fork);

            STATE.projects.state = ownRepos.length === 0 ? 'empty' : 'success';
            STATE.projects.data = ownRepos;
            STATE.projects.allLanguages = extractLanguages(ownRepos);

            renderFilterButtons();
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

            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }
}

loadProjects();
