const getInitialTheme = () => {
    const sessionTheme = sessionStorage.getItem('theme');
    if (sessionTheme) return sessionTheme;

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
