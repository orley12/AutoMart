const carId = localStorage.getItem('carId');
const url = `http://localhost:8081/api/v1/car/${carId}`;

const price = document.querySelector('.price');
const manufacturer = document.querySelector('.manufacturer');
const model = document.querySelector('.model');
const info = document.querySelector('.info');
const carImg = document.querySelector('.main-img');
const flag = document.querySelector('.fraud');
const flagImg = document.querySelector('.flag-img');
const exteriorImg = document.querySelector('.exterior-img-thumb');
const interiorImg = document.querySelector('.interior-img-thumb');
const engineImg = document.querySelector('.engine-img-thumb');
const deleteButton = document.querySelector('.delete');
const editButton = document.querySelector('.edit');
const buyButton = document.querySelector('#button-buy');
const ownerControls = document.querySelector('.owner-controls');
ownerControls.style.display = 'none';

const sendRequest = method => fetch(url, {
  method,
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const insertData = (data) => {
  price.innerHTML = `Price: #${data.price}`;
  manufacturer.innerHTML = `${data.manufacturer}(${data.body_type})`;
  model.innerHTML = `Model: ${data.model}`;
  info.innerHTML = `A ${data.state} ${data.manufacturer} ${data.model} ${data.body_type} ${data.year},
   costing ${data.price}, located at {location} .`;
  carImg.src = data.exterior_img;
  if (data.exterior_img) {
    exteriorImg.src = data.exterior_img;
  }
  if (data.interior_img) {
    interiorImg.src = data.interior_img;
  }
  if (data.engine_img) {
    engineImg.src = data.engine_img;
  }
};

const isOwner = (owner) => {
  const userData = localStorage.getItem('userDetails');
  const user = JSON.parse(userData);
  if (owner === user.id) {
    ownerControls.style.display = 'flex';
  }
};

const displayData = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      if (responseJson.status === 200) {
        // console.log(responseJson.data.owner);
        isOwner(responseJson.data.owner);
        insertData(responseJson.data);
      } else {
        const message = 'Error getting cars';
        // notification.style.display = 'block';
        // errorFlashMessage(message);
      }
    }).catch(() => {
      const message = 'Error in connecting, Please check your internet connection and try again';
      // notification.style.display = 'block';
      // errorFlashMessage(message);
    });
};

// const getOrderData = () => ({ carId,  });

buyButton.addEventListener('click', () => {
  localStorage.setItem('carId', JSON.stringify(carId));
  window.location = 'checkout.html';
});

flag.addEventListener('click', () => {
  flagImg.src = './img/scam.svg';
  localStorage.setItem('carId', JSON.stringify(carId));
  flag.removeEventListener('click', () => {});
  window.location = 'index.html#contact-form';
});

deleteButton.addEventListener('click', () => {
  sendRequest('delete');
});

editButton.addEventListener('click', () => {
  localStorage.setItem('carId', JSON.stringify(carId));
  window.location = 'update.html';
});

const makeRequest = () => {
  const Car = sendRequest('get');
  displayOrders(Car);
};

makeRequest();
