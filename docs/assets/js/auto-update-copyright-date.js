document.addEventListener('DOMContentLoaded', function () {
    document$.subscribe(({ body }) => { 
        const globe = document.querySelector('.md-copyright__highlight');
        globe.innerHTML = globe.innerHTML.replace('NOW', new Date().getFullYear());
    })
});
