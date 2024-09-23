

<!-- 使引入的页面支持 Naive UI 组件并作静态使用，若需要动态脚本内容，请不要引入此片段并复制此内容到对应页面 -->
<!-- 若需要挂载特定 Vue App ，可以修改此处的 tagID: yiges-global-vue-app -->
<!-- 注意使用了全局 Vue App 则不要再在页面中挂载别的 Vue App -->
<!-- 由于 instant 加载的缘故，某些 Vue 组件可能渲染不正常，第二个脚本让使用了这个片段的页面在加载时强制刷新 -->
---8<--- [start: auto-mount-yiges-global-vue-apps]
<script>
document.addEventListener('YigesVueAppManagerReady', () => {
    for (const ele of document.querySelectorAll('.yiges-global-vue-app')) {
        
        const eleId = ele.id

        const yigesVueAppManager = YigesVueAppManager.get(eleId)
        const App = {
            setup() {
                return {
                    window: window,
                    theme: yigesVueAppManager.theme,
                    themeOverrides: yigesVueAppManager.themeOverrides,
                    Vue: Vue,
                }
            },
            unmounted() {
                console.log('unmounted')
            }
        }
        yigesVueAppManager.create(App)
    }
});
</script>
<script>
(() => {
    if (window.YigesVueAppManager) {
        location.reload()
    }
})()
</script>
---8<--- [end: auto-mount-yiges-global-vue-apps]