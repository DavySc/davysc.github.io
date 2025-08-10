"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toggleButton = document.getElementById('navbar-toggle');
const menu = document.getElementById('navbar-menu');
if (toggleButton && menu) {
    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}
//# sourceMappingURL=menuButton.js.map