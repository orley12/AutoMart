/* eslint-disable no-plusplus */
const bodyTypeViews = document.getElementsByClassName('body-type-img');
const manufacturerViews = document.getElementsByClassName('make');
const searchButton = document.querySelector('#search-button');
const make = document.querySelector('.index-make');
const bodytype = document.querySelector('.index-body');
const state = document.querySelector('.index-state');

const getQueryParams = () => {
  const queryParams = [];
  const makeParam = make.options[make.selectedIndex].value;
  const bodytypeParam = bodytype.options[bodytype.selectedIndex].value;
  const stateParam = state.options[state.selectedIndex].value;
  if (makeParam) {
    queryParams.push(`manufacturer=${makeParam}`);
  }
  if (bodytypeParam) {
    queryParams.push(`bodytype=${bodytypeParam}`);
  }
  if (stateParam) {
    queryParams.push(`state=${stateParam}`);
  }
  return queryParams;
};

searchButton.addEventListener('click', () => {
  const queryParams = getQueryParams();
  localStorage.setItem('query', JSON.stringify(queryParams));
  window.location = 'vehicles.html';
});

for (let i = 0; i < bodyTypeViews.length; i++) {
  bodyTypeViews[i].addEventListener('click', (e) => {
    const query = e.currentTarget.querySelector('h1').innerHTML;
    const queryArray = [`bodytype=${query.toLowerCase()}`];
    localStorage.setItem('query', JSON.stringify(queryArray));
    window.location = 'vehicles.html';
  });
}

for (let i = 0; i < manufacturerViews.length; i++) {
  manufacturerViews[i].addEventListener('click', (e) => {
    const query = e.currentTarget.querySelector('h5').innerHTML;
    const queryArray = [`manufacturer=${query.toLowerCase()}`];
    localStorage.setItem('query', JSON.stringify(queryArray));
    window.location = 'vehicles.html';
  });
}
