

<!-- 使引入的页面支持 Naive UI 组件并作静态使用，适用于需要简单使用一些静态组件的情况 -->
<!-- 使用时在需要支持的 div 上打上 yiges-global-vue-app 类并指定 id 即可-->
<!-- 由于 instant 加载的缘故，某些 Vue 组件可能渲染不正常，第二个脚本让使用了这个片段的页面在加载时强制刷新 -->
---8<--- [start: auto-mount-yiges-global-vue-apps]
<script>
document.addEventListener('YigesVueAppManagerReady', () => {
    for (const ele of document.querySelectorAll('.yiges-global-vue-app')) {

        const yigesVueAppManager = YigesVueAppManager.getManagerById(ele.id)
        yigesVueAppManager.mountApp({
            setup() {
                return {
                    ...yigesVueAppManager.defaultSetups,
                }
            }
        })
    }
});
</script>
---8<--- [end: auto-mount-yiges-global-vue-apps]

---8<--- [start: auto-reload-yiges-vue-apps]
<script>
(() => {
    if (window.YigesVueAppManager) {
        location.reload()
    }
})()
</script>
---8<--- [end: auto-reload-yiges-vue-apps]