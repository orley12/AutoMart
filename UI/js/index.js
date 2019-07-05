/* eslint-disable no-plusplus */
const bodyTypeViews = document.getElementsByClassName('body-type-img');
const manufacturerViews = document.getElementsByClassName('make');

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
