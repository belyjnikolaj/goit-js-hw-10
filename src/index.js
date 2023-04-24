//Імпортуємо функцію debounce з бібліотеки Lodash
import debounce from 'lodash.debounce';
//Імпортуємо модуль Notiflix
import Notiflix from 'notiflix';
// Імпортуємо стилі CSS
import './css/styles.css';
// Імпортуємо функцію fetchCountries
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
// Знаходимо елементи
const inputElement = document.querySelector('input#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Додаємо обробник події для введення даних у поле вводу
inputElement.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// Створюємо функцію для обробки даних
function onInput(evt) {
  evt.preventDefault();
  const name = evt.target.value.trim();
  // Якщо поле пусте, очищаємо його
  if (!name) {
    list.innerHTML = '';
    return;
  }
  // Викликаємо функцію та передаємо їй введене значення
  fetchCountries(name)
    .then(countries => {
      if (countries.length === 1) {
        // Якщо знайдено лише одну країну, виводимо її детальну інформацію
        const country = countries[0];
        const markup = createMarkup(country);
        countryInfo.innerHTML = markup;
        list.innerHTML = '';
      } else if (countries.length > 10) {
        // Якщо знайдено більше 10 країн, виводимо повідомлення
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        // Якщо знайдено від 2 до 10 країн, виводимо список
        const postsMarkup = renderPosts(countries);
        list.innerHTML = postsMarkup;
        countryInfo.innerHTML = '';
      }
    })
    .catch(err => {
      Notiflix.Notify.failure(err.message);
    }); // Якщо помилка при вводі то видаємо повідомлення
}
// Створюємо функцію, яка створює розмітку для списку країн при неповному виведенні назви
function renderPosts(countries) {
  const postsMarkup = countries
    .map(country => {
      const {
        name: { official },
        flags: { svg },
      } = country;
      return `<li class="country-item">
        <img src="${svg}" alt="${official}" width="30" height="20">
        <p>${official}</p>
      </li>`;
    })
    .join('');
  return postsMarkup;
}
// Створюємо функцію яка Функція, яка створює розмітку для детальної інформації про країну
function createMarkup(country) {
  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = country;
  return `<ul class="container-list">
              <li class="container-item">
                <img src="${svg}" alt="${official}" width="30" height="20" />
                <h1>${official}</h1>
              </li>
              <li class="container-item">
                <h3>Capital:</h3>
                <span>${capital}</span>
              </li>
              <li class="container-item">
                <h3>Population:</h3>
                <span>${population}</span>
              </li>
              <li class="container-item">
                <h3>Languages:</h3>
                <span>${Object.values(languages).join(', ')}</span>
              </li>
            </ul>`;
}
