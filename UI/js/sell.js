const url = 'http://localhost:8081/api/v1/car';

const make = document.querySelector('#make');
const model = document.querySelector('#model');
const bodyType = document.querySelector('#body-type');
const milage = document.querySelector('#milage');
const state = document.querySelector('#state');
const transmission = document.querySelector('#transmission');
const price = document.querySelector('#price');
const year = document.querySelector('#year');
const interiorImage = document.querySelector('#interior-img');
const exteriorImage = document.querySelector('#exterior-img');
const engineImage = document.querySelector('#engine-img');
const sellForm = document.querySelector('#sell-form');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const getInputs = () => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({
    manufacturer: make.options[make.selectedIndex].value,
    model: model.value,
    bodyType: bodyType.options[bodyType.selectedIndex].value,
    milage: milage.value,
    state: state.options[state.selectedIndex].value,
    transmission: transmission.options[state.selectedIndex].value,
    price: price.value,
    year: year.value,
  }));
  formData.append('interior', interiorImage.files[0]);
  formData.append('exterior', exteriorImage.files[0]);
  formData.append('engine', engineImage.files[0]);
  return formData;
};
const postsigninData = (userInfo) => {
  return fetch(url, {
    method: 'post',
    mode: 'cors',
    body: userInfo,
    headers: {
      'x-access-token': localStorage.getItem('token'),
    },
  });
};

const successFlashMessage = (message) => {
  console.log(message);
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
      if (responseJson.status <= 300) {
        console.log(responseJson);
        // setTimeout(() => {
        //   window.location = 'index.html';
        // }, 15000);
        // localStorage.setItem('token', responseJson.data.token);
        // localStorage.setItem('userDetails', JSON.stringify(responseJson.data));
        // localStorage.setItem('loggedIn', true);
        successFlashMessage(responseJson.message);
      } else {
        console.log(responseJson);
        console.log(responseJson.errors);
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = ['Error in connecting, Please check your internet connection and try again'];
      errorFlashMessage(message);
    });
};

sellForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.style.display = 'block';
  const userInfo = getInputs();
  const resposeData = postsigninData(userInfo);
  console.log(resposeData);
  displayData(resposeData);
});
