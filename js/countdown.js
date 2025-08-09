var countdownEl = document.getElementById('countdown');
var tripStart = new Date(2025, 7, 3); // 3 August 2025
var today = new Date();
// Milliseconds in one day
var msPerDay = 24 * 60 * 60 * 1000;
// Calculate remaining days until trip starts
var daysLeft = Math.ceil((tripStart.getTime() - today.getTime()) / msPerDay);
// Update the countdown text, if the element exists
if (countdownEl) {
    countdownEl.textContent = "Nog ".concat(daysLeft, " nachtjes slapen tot vakantie!");
}
