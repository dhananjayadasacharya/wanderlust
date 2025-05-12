document.addEventListener('DOMContentLoaded', function() {
    const searchCollapse = document.getElementById('searchCollapse');
    const navCollapse = document.getElementById('navbarNav');

    navCollapse.addEventListener('show.bs.collapse', function () {
        const bsCollapse = bootstrap.Collapse.getInstance(searchCollapse);
        if (bsCollapse) bsCollapse.hide();
    });

    searchCollapse.addEventListener('show.bs.collapse', function () {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
    });
});