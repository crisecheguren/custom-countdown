const getById = id => document.getElementById(id);
const inputContainer = getById('input-container');
const countdownForm = getById('countdownForm');
const dateEl = getById('date-picker');
const countdownEl = getById('countdown');
const countdownElTitle = getById('countdown-title');
const countdownBtn = getById('countdown-button');
const timeElements = document.querySelectorAll('span');
const completeEl = getById('complete');
const completeElInfo = getById('complete-info');
const completeBtn = getById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const today = new Date().toISOString().split('T')[0];

dateEl.setAttribute('min', today);

const updateDOM = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const mins = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    inputContainer.hidden = true;

    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      countdownElTitle.textContent = countdownTitle;
      [timeElements[0].textContent, timeElements[1].textContent, timeElements[2].textContent, timeElements[3].textContent] = [days, hours, mins, seconds];
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
};

const updateCountdown = (e) => {
  e.preventDefault();
  [countdownTitle, countdownDate] = [e.srcElement[0].value, e.srcElement[1].value];
  savedCountdown = { title: countdownTitle, date: countdownDate };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (countdownDate === '') {
    alert('Please select a date for the countdown.');
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

const reset = () => {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  clearInterval(countdownActive);
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
};

const restorePreviousCountdown = () => {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    [countdownTitle, countdownDate] = [savedCountdown.title, savedCountdown.date];
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
};

countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

restorePreviousCountdown();
