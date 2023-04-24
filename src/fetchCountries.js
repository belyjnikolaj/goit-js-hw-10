const BASE_URL = 'https://restcountries.com/v3.1';
const ENDPOINT = '/name';

function fetchCountries(name) {
  const URL = `${BASE_URL}${ENDPOINT}/${name}?fields=name,capital,population,flags,languages`;
  return fetch(URL)
    .then(resp => {
      if (!resp.ok) {
        if (resp.status === 404) {
          throw new Error('Oops, there is no country with that name');
        } else {
          throw new Error(resp.statusText);
        }
      }
      return resp.json();
    })
    .then(data => {
      if (data.length === 0) {
        throw new Error('Oops, there is no country with that name');
      }
      return data;
    });
}

export { fetchCountries };
