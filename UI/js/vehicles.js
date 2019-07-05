/* eslint-disable no-plusplus */
let url = 'http://localhost:8081/api/v1/car?';

const price = document.querySelector('.select-price');
const state = document.querySelector('.select-state');
const make = document.querySelector('.select-make');
const bodyType = document.querySelector('.select-body');
const searchForm = document.querySelector('#search-form');
const carCollection = document.querySelector('.collection-section');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const processUrl = (queryArray) => {
  let urlValue = url;
  if (queryArray) {
    for (let i = 0; i < queryArray.length; i++) {
      if (i === queryArray.length - 1) {
        urlValue += `${queryArray[i]}`;
      } else {
        urlValue += `${queryArray[i]}&`;
      }
    }
    localStorage.removeItem('query');
  }
  return urlValue;
};

if (localStorage.getItem('query')) {
  const queryJson = localStorage.getItem('query');
  const queryArray = JSON.parse(queryJson);
  url = processUrl(queryArray);
}

const getAllCars = () => fetch(url, {
  method: 'get',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const createCard = (data) => {
  const cardHolder = document.createElement('div');
  cardHolder.setAttribute('class', 'body-type-img col-12');

  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  cardHolder.appendChild(card);

  const image = document.createElement('img');
  image.src = data.exteriorimg;
  image.alt = `${data.manufacturer} ${data.model}`;
  card.appendChild(image);

  const carinfo = document.createElement('div');
  carinfo.setAttribute('class', 'container');
  card.appendChild(carinfo);

  const carModel = document.createElement('h4');
  const carYear = document.createElement('b');
  const textYear = document.createTextNode(`${data.year} ${data.manufacturer}`);
  carYear.appendChild(textYear);

  const textModel = document.createTextNode(data.model);
  const textSpace = document.createTextNode(' ');
  carModel.appendChild(carYear);
  carModel.appendChild(textSpace);
  carModel.appendChild(textModel);
  carinfo.appendChild(carModel);

  const carPrice = document.createElement('p');
  const textPrice = document.createTextNode(
    `${data.price} | ${data.milage} Milage`,
  );
  carPrice.appendChild(textPrice);
  carinfo.appendChild(carPrice);

  const carLocation = document.createElement('h5');
  const textLocation = document.createTextNode('Ikorodu, Lagos');
  carLocation.appendChild(textLocation);
  carinfo.appendChild(carLocation);

  carCollection.appendChild(cardHolder);

  cardHolder.addEventListener('click', () => {
    window.location = 'details.html';
    localStorage.setItem('carId', JSON.stringify(data.id));
  });
};

const insertData = (carData) => {
  carData.forEach((data) => {
    createCard(data);
  });
};

const flashMessage = (message) => {
  console.log(message);
  const listItem = document.createElement('li');
  const text = document.createTextNode(message);
  listItem.appendChild(text);
  if (unorderedlist.childNodes.length > 0) {
    unorderedlist.innerHTML = '';
  }
  unorderedlist.appendChild(listItem);
};

const displayData = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      if (responseJson.status === 200) {
        const cars = responseJson.data;
        if (cars.length < 1) {
          notification.style.display = 'block';
          flashMessage('No Cars Are Available at this time, please check back later');
        }
        insertData(cars);
      } else {
        flashMessage('Error getting cars please try again');
        notification.style.display = 'block';
      }
    }).catch(() => {
      flashMessage('Error in connecting, Please check your internet connection and try again');
      notification.style.display = 'block';
    });
};

const getMinMaxPrice = (priceValue) => {
  const priceArray = [];
  const priceParam = priceValue.split('|');
  const minPrice = parseInt(priceParam[0], 10);
  const maxPrice = parseInt(priceParam[1], 10);
  priceArray.push(minPrice);
  priceArray.push(maxPrice);
  return priceArray;
};

const createQueryParam = (
  bodyParam,
  stateParam,
  makeParam,
  minPrice,
  maxPrice,
) => {
  const queryParam = [];
  if (bodyParam) {
    queryParam.push(`bodytype=${bodyParam}`);
  }
  if (stateParam) {
    queryParam.push(`state=${stateParam}`);
  }
  if (makeParam) {
    queryParam.push(`manufacturer=${makeParam}`);
  }
  if (minPrice) {
    queryParam.push(`minPrice=${minPrice}`);
  }
  if (maxPrice) {
    queryParam.push(`maxPrice=${maxPrice}`);
  }
  return queryParam;
};

const getQueryParams = () => {
  const priceParam = price.options[price.selectedIndex].value;
  const stateParam = state.options[state.selectedIndex].value;
  const makeParam = make.options[make.selectedIndex].value;
  const bodyParam = bodyType.options[bodyType.selectedIndex].value;
  const [minPrice, maxPrice] = getMinMaxPrice(priceParam);
  return createQueryParam(
    bodyParam,
    stateParam,
    makeParam,
    minPrice,
    maxPrice,
  );
};

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const queryParams = getQueryParams();
  localStorage.setItem('query', JSON.stringify(queryParams));
  window.location = 'vehicles.html';
});

const makeRequest = () => {
  const allCars = getAllCars();
  displayData(allCars);
};

makeRequest();
