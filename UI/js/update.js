const carId = JSON.parse(localStorage.getItem('carId'));

const price = document.querySelector('#price');
const status = document.querySelector('#status');
const updateForm = document.querySelector('#update-form');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

let priceValue;
let statusValue;

const postsigninData = (value, path) => fetch(`http://localhost:8081/api/v1/car/${carId}/${path}`, {
  method: 'PATCH',
  mode: 'cors',
  body: JSON.stringify(value),
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('token'),
  },
});

const successFlashMessage = (message) => {
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
      if (responseJson.status === 200) {
        const message = `${responseJson.data.manufacturer} ${responseJson.data.model} updated`;
        successFlashMessage(message);
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = 'Error in connecting, Please check your internet connection and try again';
      errorFlashMessage(message);
    });
};

price.addEventListener('change', () => {
  priceValue = price.value;
});

status.addEventListener('change', () => {
  statusValue = status.options[status.selectedIndex].value;
});

updateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.style.display = 'block';
  let resposeData = null;
  if (statusValue) {
    resposeData = postsigninData({ status: statusValue }, 'status');
  }
  if (priceValue) {
    resposeData = postsigninData({ price: priceValue }, 'price');
  }
  if (resposeData) {
    displayData(resposeData);
  } else {
    const message = 'No response try again';
    errorFlashMessage(message);
  }
});
