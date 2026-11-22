document.addEventListener('DOMContentLoaded', () => {
    // Session timer
    const timerElement = document.getElementById('session-timer');
    let secondsElapsed = 0;

    const formatTime = (totalSeconds) => {
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    window.setInterval(() => {
        secondsElapsed += 1;
        timerElement.textContent = formatTime(secondsElapsed);
    }, 1500);

    // Switching between sections without reloading the web page
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const defaultSectionId = 'catalog';

    const renderRoute = () => {
        const currentHash = window.location.hash.replace('#', '');
        const isValidSection = Array.from(sections).some(
            (section) => section.id === currentHash
        );
        const targetId = isValidSection ? currentHash : defaultSectionId;

        // Managing visibility of sections
        sections.forEach((section) => {
            if (section.id === targetId) {
                section.classList.remove('is-hidden');
            } else {
                section.classList.add('is-hidden');
            }
        });

        // Visual indication of the active menu item
        navLinks.forEach((link) => {
            const linkTarget = link.getAttribute('href').replace('#', '');
            link.classList.toggle('is-active', linkTarget === targetId);
        });
    };

    // Listening for changes in the URL fragment (clicks on links and Back/Forward buttons)
    window.addEventListener('hashchange', renderRoute);

    // Initializing the initial state when the page loads
    renderRoute();

    // Mutually exclusive catalog screen states
    const workspace = document.querySelector('.workspace');
    const statePanels = workspace.querySelectorAll('[data-state]');
    const previewButtons = document.querySelectorAll('[data-show-state]');
    const filterInput = document.getElementById('catalog-filter');
    const cards = workspace.querySelectorAll('[data-state="content"] .card');
    const resetFiltersButton = document.getElementById('reset-filters');
    const retryButton = document.getElementById('retry-load');
    let loadTimerId = null;

    const activeState = () => {
        const panel = workspace.querySelector('[data-state]:not(.is-hidden)');
        return panel ? panel.dataset.state : 'content';
    };

    const renderState = (stateName) => {
        statePanels.forEach((panel) => {
            const isActive = panel.dataset.state === stateName;
            panel.classList.toggle('is-hidden', !isActive);
            panel.setAttribute('aria-hidden', String(!isActive));
        });

        previewButtons.forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.showState === stateName));
        });

        workspace.setAttribute('aria-busy', stateName === 'loading' ? 'true' : 'false');
    };

    const cancelPendingLoad = () => {
        if (loadTimerId !== null) {
            window.clearTimeout(loadTimerId);
            loadTimerId = null;
        }
    };

    const showLoadingThen = (nextState) => {
        cancelPendingLoad();
        renderState('loading');
        loadTimerId = window.setTimeout(() => {
            loadTimerId = null;
            renderState(nextState);
        }, 1500);
    };

    const visibleCardCount = () => {
        const query = filterInput.value.trim().toLowerCase();
        let visible = 0;

        cards.forEach((card) => {
            const matches = card.textContent.toLowerCase().includes(query);
            card.classList.toggle('is-hidden', !matches);
            if (matches) {
                visible += 1;
            }
        });

        return visible;
    };

    const applyFilter = () => {
        const state = activeState();
        if (state === 'loading' || state === 'error') {
            return;
        }

        const query = filterInput.value.trim();
        const visible = visibleCardCount();
        renderState(query && visible === 0 ? 'empty' : 'content');
    };

    previewButtons.forEach((button) => {
        button.addEventListener('click', () => {
            cancelPendingLoad();
            const nextState = button.dataset.showState;

            if (nextState === 'content') {
                const query = filterInput.value.trim();
                const visible = visibleCardCount();
                renderState(query && visible === 0 ? 'empty' : 'content');
                return;
            }

            renderState(nextState);
        });
    });

    filterInput.addEventListener('input', applyFilter);

    resetFiltersButton.addEventListener('click', () => {
        cancelPendingLoad();
        filterInput.value = '';
        cards.forEach((card) => {
            card.classList.remove('is-hidden');
        });
        renderState('content');
    });

    retryButton.addEventListener('click', () => {
        const query = filterInput.value.trim();
        const visible = visibleCardCount();
        showLoadingThen(query && visible === 0 ? 'empty' : 'content');
    });

    showLoadingThen('content');
});
