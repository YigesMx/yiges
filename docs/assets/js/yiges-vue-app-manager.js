document.addEventListener('DOMContentLoaded', function () {
    const YigesVueAppManager = (function() {
        const mountedApps = {};

        function getDefaults() {

            const body = document.querySelector('body');

            const theme = Vue.ref(null)
            const themeOverrides = Vue.ref(null)

            const update_naive_theme = async (attr) => {

                // update theme mode
                
                if (attr === '(prefers-color-scheme: light)') {
                    theme.value = null;
                } else if (attr === '(prefers-color-scheme: dark)') {
                    theme.value = naive.darkTheme;
                } else {
                    const md_color_scheme = body.getAttribute('data-md-color-scheme');
                    theme.value = md_color_scheme === 'default' ? null : naive.darkTheme;
                }

                // update theme overrides

                const newPrimaryColor = getComputedStyle(body).getPropertyValue('--md-primary-fg-color--light'); 
                const newPrimaryColorHover = getComputedStyle(body).getPropertyValue('--md-accent-fg-color');
                const newPrimaryColorPressed = getComputedStyle(body).getPropertyValue('--md-primary-fg-color');
                const newPrimaryColorSuppl = getComputedStyle(body).getPropertyValue('--md-primary-fg-color--dark');

                themeOverrides.value = {
                    common: {
                        primaryColor: newPrimaryColor,
                        primaryColorHover: newPrimaryColorHover,
                        primaryColorPressed: newPrimaryColorPressed,
                        primaryColorSuppl: newPrimaryColorSuppl,
                    }
                }
            }

            // update first loaded
            const md_theme_mode = body.getAttribute('data-md-color-media');
            update_naive_theme(md_theme_mode);

            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === 'data-md-color-media') {
                        const md_theme_mode = body.getAttribute('data-md-color-media');
                        
                        update_naive_theme(md_theme_mode);
                    }
                });
            });

            observer.observe(body, {
                attributes: true,
                attributeFilter: ['data-md-color-media'],
            });

            function openLink(url) {
                if(url.startsWith('http')){
                    window.open(url, '_blank');
                } else if (url.startsWith('/') || url.startsWith('#')) {
                    // window.location.assign(url);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }

            return {
                theme: theme,
                themeOverrides: themeOverrides,
                window: window,
                Vue: Vue,
                utils: {
                    openLink: openLink,
                },
            };
        }

        function mountApp(appTagID, App) {
            const targetElement = document.getElementById(appTagID);
            if (!targetElement) {
                return;
            }

            if (mountedApps[appTagID]) {
                return mountedApps[appTagID];
            }

            const app = Vue.createApp(App);
            app.use(naive);
            app.mount(`#${appTagID}`);

            mountedApps[appTagID] = app;
            return app;
        }

        function unmountApp(appTagID) {
            if (mountedApps[appTagID]) {
                mountedApps[appTagID].unmount();
                delete mountedApps[appTagID];
                mountedApps[appTagID] = undefined;
            }
        }

        function unmountAllApps() {
            for (const key in mountedApps) {
                unmountApp(key);
            }
        }

        function getRemixIconRender(icon) {
            return () => Vue.h("i", {class: [icon]});
        };

        return {
            mountedApps,
            getDefaults: getDefaults,
            mountApp: mountApp,
            unmountAllApps: unmountAllApps,
            getRemixIconRender: getRemixIconRender,
        };
    })();
    
    window.YigesVueAppManager = YigesVueAppManager;

    document$.subscribe(({ body }) => {
        YigesVueAppManager.unmountAllApps();
        YigesEventManager.publish('YigesVueAppManagerReload');
    });

});