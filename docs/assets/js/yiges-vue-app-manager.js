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

            return {
                theme: theme,
                themeOverrides: themeOverrides,
                window: window,
                Vue: Vue,
            };
        }

        return {
            mountedApps,
            getDefaults: getDefaults,
            mountApp: function(appTagID, App) {
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
            },
            unmountAllApps: function() {
                for (const key in mountedApps) {
                    if(!mountedApps[key]) continue;
                    mountedApps[key].unmount();
                    delete mountedApps[key];
                    mountedApps[key] = undefined;
                }
            }
        };
    })();
    
    window.YigesVueAppManager = YigesVueAppManager;

    document$.subscribe(({ body }) => {
        YigesVueAppManager.unmountAllApps();
        // const reloadEvent = new Event('YigesVueAppManagerReload');
        // document.dispatchEvent(reloadEvent);
        YigesEventManager.publish('YigesVueAppManagerReload');
    });

});