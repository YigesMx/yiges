

<!-- 使引入的页面支持 Naive UI 组件并作静态使用，适用于需要简单使用一些静态组件的情况 -->
<!-- 使用时在需要支持的 div 上打上 yiges-global-vue-app 类并指定 id 即可-->
---8<--- [start: auto-mount-yiges-global-vue-apps]
<script>
YigesEventManager.subscribe("YigesVueAppManagerReload", "yiges-global-vue-app", ()=>{
    for (const ele of document.querySelectorAll('.yiges-global-vue-app')) {

        YigesVueAppManager.mountApp(ele.id,{
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