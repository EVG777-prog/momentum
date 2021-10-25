import playList from './playList.js';

// translate
let srcPhotoBack;
let langSite = 'ru';
let bgNum = getRandomNum();

const lang = {
    ru: {
        dayOfWeek: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        timeDay: ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'],
        quotes: 'dataQuotesRU.json',
    },
    en: {
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeDay: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
        quotes: 'dataQuotesEN.json',
    },
};



// show time

const timeText = document.querySelector('.time');
const dateText = document.querySelector('.date');
const welcome = document.querySelector('.greeting-container');
const welcomeText = welcome.querySelector('.greeting');
const welcomeName = welcome.querySelector('input');
const body = document.querySelector('body');

function showTime() {
    const time = new Date();
    let hours = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
    let mins = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`;
    let secs = time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`;
    timeText.textContent = `${hours}:${mins}:${secs}`;
    showDate();
    showGreeting();

    setTimeout(showTime, 1000);
}

function showDate() {
    const time = new Date();
    let day = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`;
    let month = new Date().toLocaleString(`${langSite}`, { month: 'long' });
    let date = lang[langSite].dayOfWeek[time.getDay()];
    dateText.textContent = `${date}, ${month} ${day}`;
}



// Welcome text

window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);


function getSlideNext() {
    bgNum = bgNum < 20 ? bgNum + 1 : 1;
    setBg();
}

function getSlidePrev() {
    bgNum = bgNum > 0 ? bgNum - 1 : 20;
    setBg();
}

function getTimeOfDay() {
    const hours = new Date().getHours();
    return ['Night', 'Morning', 'Day', 'Evening'][Math.floor(hours / 6)];
}

function showGreeting() {
    const hours = new Date().getHours();
    welcomeText.textContent = lang[langSite].timeDay[Math.floor(hours / 6)];
}

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        welcomeName.value = localStorage.getItem('name');
    }
}

function setLocalStorage() {
    localStorage.setItem('name', welcomeName.value);
}

// picture slider



const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

function getRandomNum() {
    return Math.ceil(Math.random() * 20);
}

function setBg2(image) {
    const img = new Image();
    img.src = image;
    // console.log(img.src);

    img.addEventListener('load', () => {
        body.style.background = `url(${img.src}) center/cover, rgba(0, 0, 0, 0.5)`;
        // background: `url(${img.src}) center/cover, rgba(0, 0, 0, 0.5)`;
    });
}

function setBg() {
    switch (srcPhotoBack) {
        case 'GitHub':
            let srcPhoto = `https://raw.githubusercontent.com/EVG777-prog/stage1-tasks/assets/images/${getTimeOfDay().toLowerCase()}/${String(bgNum).padStart(2, '0')}.jpg`;
            setBg2(srcPhoto);
            break;
        case 'Unsplash':
            getPhotosUnsplash();
            break;
        case 'Flickr':
            getPhotosFlickr();
            break;
    }
}


// weather
const cityWeather = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherDescription = document.querySelector('.weather-description');

cityWeather.value = localStorage.getItem('city') ? localStorage.getItem('city') : 'Минск';


cityWeather.addEventListener('change', (el) => {

    const reg = /^[a-zA-Zа-яА-Я -]+$/;

    if (el.target.value && reg.test(el.target.value)) {
        document.querySelector('.tip').classList.remove('active');
        localStorage.setItem('city', el.target.value);
        getWeather(el.target.value);
    } else {
        document.querySelector('.tip').classList.add('active');
    }
});

async function getWeather(city = 'Минск') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${langSite}&appid=2af3b33dfcc2eeb40fea84d055efd81c&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    wind.textContent = `${langSite == 'en' ? 'Wind speed' : 'Скорость ветра'}: ${Math.round(data.wind.speed)} m/s`;
    humidity.textContent = `${langSite == 'en' ? 'Humidity' : 'Влажность'}: ${Math.round(data.main.humidity)}%`;
    weatherDescription.textContent = data.weather[0].description;
}


// Quotes of the day

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

changeQuote.addEventListener('click', getQuotes);

async function getQuotes() {

    const quotes = lang[langSite].quotes;
    const res = await fetch(quotes);
    const data = await res.json();

    function getRandomQuote() {
        return Math.floor(Math.random() * data.length);
    }

    let numQuote = getRandomQuote();

    quote.textContent = data[numQuote].text;
    author.textContent = data[numQuote].author;
}



// audio player

let isPlay = false;
let numAudio = 0;
let showProgressAudio;

const playPrev = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNext = document.querySelector('.play-next');
const audio = document.querySelector('audio');
const playListT = document.querySelector('.play-list');
const playerTime = document.querySelector('.player-time');
const songRange = document.querySelector('.song-range');
const playerVolumeRange = document.querySelector('.player-volume_range');
const playerTextSong = document.querySelector('.player-text_song');
const btnVolume = document.querySelector('.player-volume_icon');

playList.forEach((el, i) => {
    playListT.innerHTML += `<li class="play-item" data-num="${i}" data-src="${el.src}">${el.duration} ${el.title}</li>`;
});
const songs = document.querySelectorAll('.play-item');

play.addEventListener('click', playAudio);
playPrev.addEventListener('click', prevAudio);
playNext.addEventListener('click', nextAudio);
audio.addEventListener('ended', nextAudio);
songRange.addEventListener('input', setProgressAudio);
playerVolumeRange.addEventListener('input', setProgressVolume);
btnVolume.addEventListener('click', muteVolume);


function muteVolume() {
    audio.muted = audio.muted ? false : true;
    btnVolume.classList.toggle('mute');
}

function nextAudio() {
    clearInterval(showProgressAudio);
    numAudio = numAudio == playList.length - 1 ? 0 : numAudio + 1;
    audio.src = playList[numAudio].src;
    clearAudioMarks();
    // document.querySelector(`.play-item[data-src="${playList[numAudio].src}"]`).classList.add('item-active');
    isPlay = false;
    playAudio();
}

function prevAudio() {
    clearInterval(showProgressAudio);
    numAudio = numAudio == 0 ? playList.length - 1 : numAudio - 1;
    audio.src = playList[numAudio].src;
    clearAudioMarks();
    // document.querySelector(`.play-item[data-src="${playList[numAudio].src}"]`).classList.add('item-active');
    isPlay = false;
    playAudio();
}

function playAudio() {
    showNameSong();

    if (!isPlay) {
        document.querySelector(`.play-item[data-src="${playList[numAudio].src}"]`).classList.add('item-active');
        audio.play();
        play.classList.add('pause');
        isPlay = true;
        // console.log(numAudio);
        // playListT.querySelector(`li[data-src="${audio.src}"`));
        showProgressAudio = setInterval(showProgress, 100);
    } else {
        audio.pause();
        play.classList.remove('pause');
        isPlay = false;
        clearInterval(showProgressAudio);
    }
}

function showNameSong() {
    playerTextSong.textContent = playList[numAudio].title;
}

function setProgressAudio() {
    audio.currentTime = audio.duration * songRange.value / 100;
}

function setProgressVolume() {
    audio.volume = playerVolumeRange.value / 100;
    audio.volume == 0 ? btnVolume.classList.add('mute') : btnVolume.classList.remove('mute');
}

function showProgress() {
    songRange.value = audio.currentTime / audio.duration * 100;
    showProgressTime();
}

function showProgressTime() {
    // console.log(audio.duration);

    let curTime = `${String(Math.trunc(audio.currentTime / 60)).padStart(2, '0')}:${String(Math.trunc(audio.currentTime % 60)).padStart(2, '0')}`;
    let durTime = `${String(Math.trunc(audio.duration / 60)).padStart(2, '0')}:${String(Math.trunc(audio.duration % 60)).padStart(2, '0')}`;
    playerTime.textContent = `${curTime} / ${durTime}`;
}

songs.forEach((el) => {
    el.addEventListener('click', (el2) => {
        clearAudioMarks();
        el.classList.add('item-active');
        audio.src = el.dataset.src;
        numAudio = +el.dataset.num;
        isPlay = false;
        playAudio();
    });
});

function clearAudioMarks() {
    songs.forEach((el) => el.classList.remove('item-active'));
}

// photo download API

async function getPhotosUnsplash() {
    const photos = `https://api.unsplash.com/photos/random?query=${getTimeOfDay().toLowerCase()}&orientation=landscape&query=nature&client_id=En_NWEzTIxNafWao419w5Lb9YNs5J1vO5rvV6r6fkqo`;
    const res = await fetch(photos);
    const data = await res.json();

    setBg2(data.urls.full);
}
async function getPhotosFlickr() {
    const photos = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=cd5e198cb0ef3addb51989f6944edf13&tags=nature&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(photos);
    const data = await res.json();

    setBg2(data.photos.photo[bgNum].url_l);
}

// setting

const btnSetting = document.querySelector('.btn-setting');

btnSetting.addEventListener('click', showMenuSetting);

function showMenuSetting() {
    document.querySelector('.table-setting').classList.toggle('active');
}

const cbxWeather = document.querySelector('#cbx-weather');
const cbxAudio = document.querySelector('#cbx-audio');
const cbxWelcome = document.querySelector('#cbx-welcome');
const cbxTime = document.querySelector('#cbx-time');
const cbxData = document.querySelector('#cbx-data');
const cbxQuotes = document.querySelector('#cbx-quotes');
const langChange = document.querySelector('#lang-change');
const settingParts = document.querySelectorAll('.cont-setting input');
const srcPictures = document.querySelector('#src-pict');

srcPictures.addEventListener('change', (el) => {
    srcPhotoBack = el.target.value;
    localStorage.setItem('srcPhotoBack', srcPhotoBack);
    setBg();
});

const visibleParts = {
    weather: true,
    audio: true,
    welcome: true,
    time: true,
    data: true,
    quotes: true
}

settingParts.forEach((el) => {
    el.addEventListener('change', showParts);
});

function showParts() {
    document.querySelector('.weather').style.visibility = document.querySelector('#cbx-weather').checked ? 'visible' : 'hidden';
    if (document.querySelector('#cbx-audio').checked) {
        document.querySelector('.player-full').style.visibility = 'visible';
        document.querySelector('.player').style.visibility = 'visible';
    } else {
        document.querySelector('.player-full').style.visibility = 'hidden';
        document.querySelector('.player').style.visibility = 'hidden';
    }
    document.querySelector('.greeting-container').style.visibility = document.querySelector('#cbx-welcome').checked ? 'visible' : 'hidden';
    document.querySelector('.time').style.visibility = document.querySelector('#cbx-time').checked ? 'visible' : 'hidden';
    document.querySelector('.date').style.visibility = document.querySelector('#cbx-date').checked ? 'visible' : 'hidden';
    if (document.querySelector('#cbx-quotes').checked) {
        document.querySelector('.change-quote').style.visibility = 'visible';
        document.querySelector('#quotes').style.visibility = 'visible';
    } else {
        document.querySelector('.change-quote').style.visibility = 'hidden';
        document.querySelector('#quotes').style.visibility = 'hidden';
    }
    saveShowParts();
}

function saveShowParts() {
    localStorage.setItem('show_weather', settingParts[0].checked);
    localStorage.setItem('show_audio', settingParts[1].checked);
    localStorage.setItem('show_welcome', settingParts[2].checked);
    localStorage.setItem('show_time', settingParts[3].checked);
    localStorage.setItem('show_date', settingParts[4].checked);
    localStorage.setItem('show_quotes', settingParts[5].checked);
}

function readShowParts() {
    settingParts[0].checked = localStorage.getItem('show_weather') == 'false' ? false : true;
    settingParts[1].checked = localStorage.getItem('show_audio') == 'false' ? false : true;
    settingParts[2].checked = localStorage.getItem('show_welcome') == 'false' ? false : true;
    settingParts[3].checked = localStorage.getItem('show_time') == 'false' ? false : true;
    settingParts[4].checked = localStorage.getItem('show_date') == 'false' ? false : true;
    settingParts[5].checked = localStorage.getItem('show_quotes') == 'false' ? false : true;
}

langChange.addEventListener('change', (el) => {

    langSite = el.target.value.toLowerCase();
    localStorage.setItem('langSite', langSite);
    changeLang();
    translateMenu();
});

// start

const contSetting = document.querySelectorAll('.cont-setting p');

start();

function start() {
    langSite = localStorage.getItem('langSite') || 'en';
    langChange.value = langSite == 'en' ? 'EN' : 'RU';
    srcPhotoBack = localStorage.getItem('srcPhotoBack') || 'GitHub';
    srcPictures.value = srcPhotoBack;
    cityWeather.value = langSite == 'en' ? 'Minsk' : 'Минск';
    getQuotes();
    getWeather(cityWeather.value);
    setBg();
    showTime();
    document.querySelector('.play-item').classList.add('item-active');
    readShowParts();
    showParts();
    translateMenu();
}

// translate site

function translateMenu() {
    if (langSite == 'ru') {
        contSetting.forEach((el) => el.style.fontSize = '18px');
        // document.querySelectorAll('.cont-setting').style.fontSize = '15px';
        document.querySelector('.table-setting p').textContent = 'Настройки:';
        contSetting[0].textContent = 'Язык';
        contSetting[1].textContent = 'Показывать погоду';
        contSetting[2].textContent = 'Показывать аудио-плеер';
        contSetting[3].textContent = 'Показывать приветствие';
        contSetting[4].textContent = 'Показывать время';
        contSetting[5].textContent = 'Показывать дату';
        contSetting[6].textContent = 'Показывать цитаты';
        contSetting[7].textContent = 'Источник картинок';
    } else if (langSite == 'en') {
        contSetting.forEach((el) => el.style.fontSize = '22px');
        // document.querySelector('.cont-setting').style.fontSize = '22px';
        document.querySelector('.table-setting p').textContent = 'Settings:';
        contSetting[0].textContent = 'Language';
        contSetting[1].textContent = 'Show weather';
        contSetting[2].textContent = 'Show audio-player';
        contSetting[3].textContent = 'Show welcome';
        contSetting[4].textContent = 'Show time';
        contSetting[5].textContent = 'Show data';
        contSetting[6].textContent = 'Show quotes';
        contSetting[7].textContent = 'Source pictures';
    }

}

function changeLang() {
    if (cityWeather.value == 'Minsk') cityWeather.value = 'Минск';
    else if (cityWeather.value == 'Минск') cityWeather.value = 'Minsk';
    getQuotes();
    getWeather(cityWeather.value);
    showTime();
}

// self-check

console.log(`
Не сделаные пункты:
- Продвинутый аудиоплеер - можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте -3
- Настройки приложения - если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото -3
- Дополнительный функционал на выбор -10

Итого: 160 - 10 - 3 - 3 = 144 балла.
`);