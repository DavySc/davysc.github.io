
const countdownEl = document.getElementById('countdown');

const tripStart = new Date(2025, 7, 3); // 3 August 2025
const today = new Date();

// Milliseconds in one day
const msPerDay = 24 * 60 * 60 * 1000;

// Calculate remaining days until trip starts
const daysLeft: number = Math.ceil((tripStart.getTime() - today.getTime()) / msPerDay);

// Update the countdown text, if the element exists
if (countdownEl) {
  countdownEl.textContent = `Nog ${daysLeft} nachtjes slapen tot vakantie!`;
}
