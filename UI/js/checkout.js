const orderForm = document.querySelector('#order-form');
const offeredPrice = document.querySelector('#offered-price');
const payBtn = document.querySelector('#pay');
const cardImg = document.querySelector('.card_img');
const cardh4 = document.querySelector('.cardh4');
const cardPara = document.querySelector('.cardP');
const cardh5 = document.querySelector('.cardh5');


const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const carId = JSON.parse(localStorage.getItem('carId'));
const orderId = JSON.parse(localStorage.getItem('orderId'));

Number(carId);

if (orderId) {
  payBtn.value = 'update';
}

const getInputs = () => ({ carId, price: offeredPrice.value });

const sendRequest = (method, url, data) => fetch(url, {
  method,
  mode: 'cors',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const flashMessage = (message) => {
  const listItem = document.createElement('li');
  const text = document.createTextNode(message);
  listItem.appendChild(text);
  if (unorderedlist.childNodes.length > 0) {
    unorderedlist.innerHTML = '';
  }
  unorderedlist.appendChild(listItem);
};

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

const showCar = (data) => {
  console.log(cardImg);
  if (data.exterior_img) {
    cardImg.src = data.exterior_img;
  } else if (data.interior_img) {
    cardImg.src = data.interior_img;
  } else if (data.engine_img) {
    cardImg.src = data.engine_img;
  }
  cardh4.innerHTML = `${data.year} ${data.manufacturer} ${data.model}`;
  cardPara.innerHTML = `${data.price} | ${data.milage} Milage`;
  cardh5.innerHTML = data.location;
};


const displayData = (data, path) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      if (responseJson.status === 200 && path === 'car') {
        showCar(responseJson.data);
      } else if (responseJson.status === 201) {
        console.log(responseJson);
        flashMessage('Order successfully created');
      } else if (responseJson.status === 200) {
        console.log(responseJson);
        flashMessage('Order successfully updated');
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = 'Error in connecting, Please check your internet connection and try again';
      flashMessage(message);
    });
};

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.style.display = 'block';
  const orderData = getInputs();

  let url;

  if (orderId) {
    url = `http://localhost:8081/api/v1/order/${orderId}/price`;

    const resposeData = sendRequest('PATCH', url, orderData);
    displayOrders(resposeData);
    localStorage.removeItem('orderId');
  } else {
    url = 'http://localhost:8081/api/v1/order';

    const resposeData = sendRequest('POST', url, orderData);
    displayOrders(resposeData);
  }
});

const makeRequest = () => {
  const url = `http://localhost:8081/api/v1/car/${carId}`;


  const car = sendRequest('get', url);
  displayOrders(car, 'car');
};

makeRequest();
