document.addEventListener('DOMContentLoaded', function () {
    const YigesVueAppManager = (function() {
        let instances = {};
    
        function createInstance(appTagID) {

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
                console.log(mutations);
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

            return new Object({
                appTagID: appTagID,
                app: null,
                defaultSetups: {
                    theme: theme,
                    themeOverrides: themeOverrides,
                    window: window,
                    Vue: Vue,
                },
                mountApp: function(App) {
                    const app = Vue.createApp(App);
                    app.use(naive);
                    app.mount(`#${this.appTagID}`);
                    this.app = app;
                    return app;
                }
            });
        }
    
        return {
            instances,
            getManagerById(appTagID) {
                if (!instances[appTagID]) {
                    instances[appTagID] = createInstance(appTagID);
                }
                return instances[appTagID];
            },
            deleteManagerById(appTagID) {
                if (instances[appTagID]) {
                    delete instances[appTagID];
                }
            }
        };
    })();
    
    window.YigesVueAppManager = YigesVueAppManager;

    document$.subscribe(({ body }) => {
        //nmount all vue apps
        for (const key in YigesVueAppManager.instances) {
            YigesVueAppManager.instances[key].app.unmount();
            YigesVueAppManager.deleteManagerById(key);
        }

        const event = new Event('YigesVueAppManagerReady');
        document.dispatchEvent(event);
    });
});