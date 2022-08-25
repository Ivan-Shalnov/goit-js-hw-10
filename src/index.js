import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  contryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
const MAX_RESULT_LENGTH = 10;
refs.input.addEventListener('input', debounce(searchCountry, 300));
function searchCountry() {
  const string = refs.input.value.trim();
  if (string === '') {
    clearCountryInfo();
    clearCountryList();
    return;
  }
  fetchCountries(string)
    .then(renderResponse)
    .catch(error => {
      switch (error.message) {
        case 'tooMuch':
          clearCountryInfo();
          clearCountryList();
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          break;
        case 'notFound':
          clearCountryInfo();
          clearCountryList();
          Notify.failure('Oops, there is no country with that name');
          break;
        default:
          Notify.warning(error.message);
      }
    });
}

function renderResponse(response) {
  if (response.length > MAX_RESULT_LENGTH) throw Error('tooMuch');

  if (response.length > 1) renderList(response);
  if (response.length === 1) renderInfo(response);
}
function countryItemTmpl(name, flag) {
  return `
  <li>
  <img class="country-list__flag" src="${flag}" alt="${name}">
  <span class="country-list__name">${name}</span>
  </li>`;
}
function renderList(data) {
  clearCountryInfo();
  const markup = data
    .map(country => countryItemTmpl(country.name.official, country.flags.svg))
    .join('');
  refs.countryList.innerHTML = markup;
}
function renderInfo([country]) {
  clearCountryList();
  let {
    name: { official: name },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;
  languages = Object.values(languages).join(', ');
  const markup = `
  <div class="country-info__name">
        <img class="country-info__flag" src="${svg}" alt="${name}" />
        ${name}
      </div>
      <dl class="country-info__desc-list">
        <dt>Capital:</dt>
        <dd>${capital}</dd>
        <dt>Population:</dt>
        <dd>${population}</dd>
        <dt>Languages:</dt>
        <dd>${languages}</dd>
      </dl>`;
  refs.contryInfo.innerHTML = markup;
}
function clearCountryInfo() {
  refs.contryInfo.innerHTML = '';
}
function clearCountryList() {
  refs.countryList.innerHTML = '';
}
