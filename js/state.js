const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

export const STATE = {
    theme: getInitialTheme(),
    projects: {
        state: 'loading',
        data: [],
        allLanguages: [],
        selectedFilter: 'all'
    },
    form: {
        errors: {
            name: '',
            email: '',
            message: ''
        },
        status: 'idle',
        lastSubmitData: null
    }
};
