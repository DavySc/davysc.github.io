const toggleButton = document.getElementById('navbar-toggle') as HTMLButtonElement | null;
const menu = document.getElementById('navbar-menu') as HTMLUListElement | null;
if (toggleButton && menu) {
    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}
