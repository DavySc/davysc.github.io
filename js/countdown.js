const countdownEl = document.getElementById('countdown');
const tripStart = new Date(2026, 7, 3); // 3 August 2026
const today = new Date();
// Milliseconds in one day
const msPerDay = 24 * 60 * 60 * 1000;
// Calculate remaining days until trip starts
const daysLeft = Math.ceil((tripStart.getTime() - today.getTime()) / msPerDay);
// Update the countdown text, if the element exists
if (countdownEl) {
    if (daysLeft < 1) {
        countdownEl.textContent = 'Het is vakantie!';
    }
    else if (daysLeft === 69) {
        countdownEl.textContent = 'Nog NICE nachtjes slapen tot vakantie';
    }
    else {
        countdownEl.textContent = `Nog ${daysLeft} nachtjes slapen tot vakantie!`;
    }
}
