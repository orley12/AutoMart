const carId = JSON.parse(localStorage.getItem('carId'));
console.log(parseInt(carId, 10));

const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
const orderList = document.querySelector('#order-list');
const advertList = document.querySelector('#adverts-list');
notification.style.display = 'none';

const getAllOrders = url => fetch(url, {
  method: 'get',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const createOrderCard = (order) => {
  const orderDiv = document.createElement('div');
  orderDiv.setAttribute('class', 'col-12 order');
  orderList.appendChild(orderDiv);

  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  orderDiv.appendChild(card);

  const orderUl = document.createElement('ul');
  orderUl.setAttribute('class', 'cardInfo');
  card.appendChild(orderUl);

  const orderModel = document.createElement('li');
  const textModel = document.createTextNode(`${order.year} ${order.manufacturer} ${order.model}`);
  orderModel.appendChild(textModel);

  const orderPrice = document.createElement('li');
  const textPrice = document.createTextNode(`Price: ${order.original_price}`);
  orderPrice.appendChild(textPrice);

  const orderBidPrice = document.createElement('li');
  const textBidPrice = document.createTextNode(`Bid Price: ${order.amount}`);
  orderBidPrice.appendChild(textBidPrice);

  const orderLocation = document.createElement('li');
  const textLocation = document.createTextNode(`Location: ${order.location}`);
  orderLocation.appendChild(textLocation);

  const orderDate = document.createElement('li');
  const textDate = document.createTextNode(`${order.created_on}`);
  advertList.appendChild(textDate);

  orderUl.appendChild(orderModel);
  orderUl.appendChild(orderPrice);
  orderUl.appendChild(orderBidPrice);
  orderUl.appendChild(orderLocation);
  orderUl.appendChild(orderDate);

  orderDiv.addEventListener('click', () => {
    localStorage.setItem('orderId', JSON.stringify(order.id));
    window.location = 'checkout.html';
  });
};

const createAdvertCard = (data) => {
  const cardHolder = document.createElement('div');
  cardHolder.setAttribute('class', 'body-type-img col-12');

  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  cardHolder.appendChild(card);

  const image = document.createElement('img');
  image.src = data.exterior_img;
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
  const textLocation = document.createTextNode(data.location);
  carLocation.appendChild(textLocation);
  carinfo.appendChild(carLocation);

  advertList.appendChild(cardHolder);

  cardHolder.addEventListener('click', () => {
    window.location = 'details.html';
    localStorage.setItem('carId', JSON.stringify(data.id));
  });
};

const displayOrders = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      console.log(responseJson);

      if (responseJson.status <= 300) {
        const orders = responseJson.data;
        orders.forEach((order) => {
          createOrderCard(order);
        });
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = ['Error in connecting, Please check your internet connection and try again'];
    //   errorFlashMessage(message);
    });
};

const displayAdverts = (data) => {
  data.then(respose => respose.json())
    .then((responseJson) => {
      console.log(responseJson);

      if (responseJson.status <= 300) {
        const orders = responseJson.data;
        orders.forEach((order) => {
          createAdvertCard(order);
        });
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = ['Error in connecting, Please check your internet connection and try again'];
    //   errorFlashMessage(message);
    });
};

const makeRequest = () => {
  const getOrdersByOwner = 'http://localhost:8081/api/v1/order';
  const getOrdersByAdvert = `http://localhost:8081/api/v1/car/${carId}/orders`;

  const allOrdersByOwner = getAllOrders(getOrdersByOwner);
  const allOrdersByAdvert = getAllOrders(getOrdersByAdvert);

  displayOrders(allOrdersByOwner);
  displayAdverts(allOrdersByAdvert);
};

makeRequest();
