import playList from './playList.js';

// Settings object
const state = {
  language: 'en',
  photoSource: 'github',
  blocks: []
};

// ===================== Time and date =====================
const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const username = document.querySelector('.name');
const city = document.querySelector('.city');

function showGreeting () {
  switch (state.language) {
    case 'ru':
      greeting.textContent = getTimeOfDay();
      username.setAttribute('placeholder', '[Введите имя]');
      break;
    default:
      greeting.textContent = `Good ${getTimeOfDay()}`;
      username.setAttribute('placeholder', '[Enter name]');
      break;
  }
}

// Date
function showDate () {
  const date = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  let currentDate;

  switch (state.language) {
    case 'ru':
      currentDate = date.toLocaleDateString('ru-RU', options);
      break;
    default:
      currentDate = date.toLocaleDateString('en-US', options);
      break;
  }

  dateElement.textContent = currentDate;
}

// Time
function showTime () {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  timeElement.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

// Current time
function сurrentTime () {
  const date = new Date();
  const hours = date.getHours();
  return hours;
}

// Get time of day
function getTimeOfDay (en) {
  let timeOfDay;

  switch (state.language) {
    case 'ru':
      if (!en) {
        timeOfDay = ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи'];
        break;
      }
    default:
      timeOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];
  }

  if (Math.trunc(сurrentTime() / 6) === 1) {
    return timeOfDay[0];
  } else if (Math.trunc(сurrentTime() / 6) === 2) {
    return timeOfDay[1];
  } else if (Math.trunc(сurrentTime() / 6) === 3) {
    return timeOfDay[2];
  } else {
    return timeOfDay[3];
  }
}

// ==================== Local Storage =====================
function setLocalStorage () {
  localStorage.setItem('name', username.textContent);
  localStorage.setItem('city', city.value);
  localStorage.setItem('lang', state.language);
  localStorage.setItem('visibleBlocks', state.blocks);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage () {
  if (localStorage.getItem('name')) {
    username.textContent = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
  if (localStorage.getItem('lang')) {
    state.language = localStorage.getItem('lang');
  }
  if (localStorage.getItem('visibleBlocks')) {
    state.blocks = localStorage.getItem('visibleBlocks');
    state.blocks = state.blocks.split(',');

    state.blocks.forEach((item, index) => {
      document.querySelector(`.${item}`).classList.add('hide-blocks');

      switchItem.forEach((elem, index) => {
        if (elem.id === item) {
          switchItemInput[index].checked = true;
        }
      });
    });
  }
}
window.addEventListener('load', getLocalStorage);

// ==================== Weather =====================
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

async function getWeather () {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=e4af04ec9f164549124d1fa086174b8b&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;

  if (state.language === 'ru') {
    wind.textContent = `Скорость ветра: ${Math.trunc(data.wind.speed)} м/c`;
    humidity.textContent = `Влажность: ${data.main.humidity}%`;
  } else {
    wind.textContent = `Wind speed: ${Math.trunc(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
  }
}

function setCity (event) {
  if (event.code === 'Enter') {
    getWeather();
    city.blur();
  }
}

window.addEventListener('load', getWeather);
city.addEventListener('keypress', setCity);

// ==================== Quote =====================
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const buttonQuote = document.querySelector('.change-quote');

function getRandom (min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

let random;

async function getQuotes () {
  const quotes = 'js/data.json';
  const res = await fetch(quotes);
  const data = await res.json();

  let randomQuote = getRandom(0, data[0].length);

  if (random) {
    randomQuote = random;
  }

  localStorage.setItem('randomQuote', randomQuote);

  switch (state.language) {
    case 'ru':
      quote.textContent = data[1][randomQuote].quote;
      author.textContent = data[1][randomQuote].author;
      break;
    default:
      quote.textContent = data[0][randomQuote].quote;
      author.textContent = data[0][randomQuote].author;
      break;
  }

  function changeQuote () {
    const randomQuote = getRandom(0, data[0].length);
    localStorage.setItem('randomQuote', randomQuote);

    switch (state.language) {
      case 'ru':
        quote.textContent = data[1][randomQuote].quote;
        author.textContent = data[1][randomQuote].author;
        break;
      default:
        quote.textContent = data[0][randomQuote].quote;
        author.textContent = data[0][randomQuote].author;
        break;
    }
  }

  buttonQuote.addEventListener('click', changeQuote);
}
window.addEventListener('load', getQuotes);

// ==================== Image Slider =====================
const body = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
let randomNum = getRandom(1, 20);

function setBg (bgNum) {
  const timeOfDay = getTimeOfDay('en').toLowerCase();
  bgNum = bgNum.toString().padStart(2, '0');

  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    document.body.style.backgroundImage = `url('${img.src}')`;
  };
}
setBg(randomNum);

// Slider functions
function getSlidePrev () {
  if (randomNum > 1) {
    randomNum--;
  } else {
    randomNum = 20;
  }

  setBg(randomNum);
}

function getSlideNext () {
  if (randomNum < 20) {
    randomNum++;
  } else {
    randomNum = 1;
  }

  setBg(randomNum);
}

slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);

// ==================== Audio =====================
let isPlay = false;
const play = document.querySelector('.play');
const audio = new Audio();
let playNum = 0;

function playAudio () {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;

  if (!isPlay) {
    audio.play();
    isPlay = true;
    play.classList.add('pause');
  } else {
    audio.pause();
    isPlay = false;
    play.classList.remove('pause');
  }

  switchTrack();
}
play.addEventListener('click', playAudio);

// Add elements
const playListElement = document.querySelector('.play-list');

function showPlayList () {
  playList.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = item.title;
    playListElement.append(li);
  });
}
window.addEventListener('load', showPlayList);

function switchTrack () {
  const playListElements = document.querySelectorAll('.play-item');
  const itemActive = document.getElementsByClassName('item-active');
  if (itemActive.length > 0 && itemActive[0] !== playListElements[playNum]) {
    itemActive[0].classList.remove('item-active');
  }

  playListElements[playNum].classList.add('item-active');
}
window.addEventListener('load', switchTrack);

const playNextElement = document.querySelector('.play-next');
function playNext () {
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }

  isPlay = false;
  playAudio();
}

const playPrevElement = document.querySelector('.play-prev');
function playPrev () {
  if (playNum > 0) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }

  isPlay = false;
  playAudio();
}

playNextElement.addEventListener('click', playNext);
playPrevElement.addEventListener('click', playPrev);
audio.addEventListener('ended', playNext);

// ==================== Settings =====================
const settingsButton = document.querySelector('.settings-button');
const hide = document.querySelector('.hide');
const settingsPopup = document.querySelector('.settings-popup');
const switchText = document.querySelectorAll('.switch-text');

// Settings button
settingsButton.addEventListener('click', (e) => {
  e.stopPropagation();
  if (settingsPopup.style.maxHeight) {
    settingsPopup.style.maxHeight = null;
    settingsButton.classList.remove('rotate');
  } else {
    settingsPopup.style.maxHeight = settingsPopup.scrollHeight + 'px';
    settingsButton.classList.add('rotate');
  }
});

settingsPopup.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', function (e) {
  if (e.target !== settingsPopup) {
    settingsPopup.style.maxHeight = null;
    settingsButton.classList.remove('rotate');
  }
});

// Change lang
function changeLang () {
  const inputs = document.querySelectorAll('.form_radio input[name=lang]');
  const lang = document.querySelectorAll('.lang');

  inputs.forEach(el => {
    if (!el.hasAttribute('checked') && el.value === state.language) {
      el.checked = true;
    }

    el.addEventListener('change', function () {
      state.language = el.value;
      getWeather();
      showGreeting();
      showDate();

      if (localStorage.getItem('randomQuote')) {
        random = localStorage.getItem('randomQuote');
      }
      getQuotes();

      switchText.forEach((item, index) => {
        switch (state.language) {
          case 'ru':
            item.textContent = ['Время', 'Дата', 'Приветствие', 'Цитаты', 'Аудио', 'Погода'][index];
            break;
          default:
            item.textContent = ['Time', 'Date', 'Greeting', 'Quotes', 'Audio', 'Weather'][index];
        }
      });

      switch (state.language) {
        case 'ru':
          lang[0].textContent = 'Английский';
          lang[1].textContent = 'Русский';
          if (city.value === 'Minsk') {
            city.value = 'Минск';
          }
          break;
        default:
          lang[0].textContent = 'English';
          lang[1].textContent = 'Russian';
          if (city.value === 'Минск') {
            city.value = 'Minsk';
          }
      }
    });
  });
}
window.addEventListener('load', changeLang);

// Hide blocks
const switchItem = document.querySelectorAll('.switch-item');
const switchItemInput = document.querySelectorAll('.switch-item input');

function hideBlocks () {
  switchItemInput.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  switchItem.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (item.id === document.querySelector(`.${item.id}`).className.split(' ')[0]) {
        document.querySelector(`.${item.id}`).classList.toggle('hide-blocks');

        if (document.querySelector(`.${item.id}`).classList.contains('hide-blocks') && !state.blocks.includes(item.id)) {
          state.blocks.push(item.id);
        } else {
          state.blocks.forEach((elem, index) => {
            if (elem === item.id) {
              state.blocks.splice(index, 1);
            }
          });
        }
      }
    });
  });
}
hideBlocks();
