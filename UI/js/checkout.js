const orderForm = document.querySelector('#order-form');
const offeredPrice = document.querySelector('#offered-price');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const getInputs = () => {
  const carId = JSON.parse(localStorage.getItem('carId'));
  return { carId, price: offeredPrice.value };
};

let orderUrl;
let orderId = localStorage.getItem('orderId');
if (orderId) {
  orderId = JSON.parse(orderId);
  orderUrl = `http://localhost:8081/api/v1/order/${orderId}/price`;
} else {
  orderUrl = 'http://localhost:8081/api/v1/order';
}

const orderRequest = (method, data) => fetch(orderUrl, {
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

const displayData = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      if (responseJson.status === 201) {
        flashMessage('Order successfully created');
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
  if (orderId) {
    const resposeData = orderRequest('PATCH', orderData);
    displayData(resposeData);
  } else {
    const resposeData = orderRequest('POST', orderData);
    displayData(resposeData);
  }
});
