/* eslint-disable no-plusplus */
let url = 'http://localhost:8081/api/v1/car';

const createQuery = (queryArray) => {
  let query;
  for (let i = 0; i < queryArray.length; i++) {
    if (queryArray[queryArray.length - 1]) {
      query = `${url}?${queryArray[i]}`;
    } else {
      query = `${url}?${queryArray[i]}&`;
    }
  }
  localStorage.removeItem('query');
  return query;
};

if (localStorage.getItem('query')) {
  const queryJson = localStorage.getItem('query');
  const queryArray = JSON.parse(queryJson);
  url = createQuery(queryArray);
  console.log(url);
}

const carCollection = document.querySelector('.collection-section');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const getAllCars = () => fetch(url, {
  method: 'get',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const errorFlashMessage = (messages) => {
  messages.forEach((message) => {
    const listItem = document.createElement('li');
    const text = document.createTextNode(message.msg);
    listItem.appendChild(text);
    if (unorderedlist.childNodes.length > 0) {
      unorderedlist.innerHTML = '';
    }
    unorderedlist.appendChild(listItem);
  });
};

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

const displayData = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      if (responseJson.status === 200) {
        insertData(responseJson.data);
      } else {
        const message = 'Error getting cars please try again';
        notification.style.display = 'block';
        errorFlashMessage(message);
      }
    }).catch(() => {
      const message = 'Error in connecting, Please check your internet connection and try again';
      notification.style.display = 'block';
      errorFlashMessage(message);
    });
};

const makeRequest = () => {
  const allCars = getAllCars();
  displayData(allCars);
};

makeRequest();
