const BASE_URL = 'https://restcountries.com/v3.1/name/';
function fetchCountries(name) {
  const searchParams = 'fields=name,capital,population,flags,languages';
  return fetch(`${BASE_URL}${name}?${searchParams}`).then(response => {
    if (response.status === 404) {
      throw Error('notFound');
    }
    return response.json();
  });
}
export { fetchCountries };
