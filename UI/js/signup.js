const url = 'http://localhost:8081/api/v1/auth/signup';

const firstName = document.querySelector('#first-name-sign-up');
const lastName = document.querySelector('#last-name-sign-up');
const email = document.querySelector('#email-sign-up');
const phone = document.querySelector('#phone-sign-up');
const password = document.querySelector('#password-sign-up');
const confirmPassword = document.querySelector('#confirm-password-sign-up');
const address = document.querySelector('#address-sign-up');
const signupForm = document.querySelector('#sign-up-form');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const getInputs = () => ({
  firstName: firstName.value,
  lastName: lastName.value,
  email: email.value,
  phone: phone.value,
  password: password.value,
  confirmPassword: confirmPassword.value,
  address: address.value,
});

const postsigninData = userInfo => fetch(url, {
  method: 'post',
  mode: 'cors',
  body: JSON.stringify(userInfo),
  headers: {
    'Content-Type': 'application/json',
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
      if (responseJson.status <= 300) {
        setTimeout(() => {
          window.location = 'index.html';
        }, 15000);
        localStorage.setItem('token', responseJson.data.token);
        localStorage.setItem('userDetails', JSON.stringify(responseJson.data));
        localStorage.setItem('loggedIn', true);
        successFlashMessage(responseJson.message);
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = ['Error in connecting, Please check your internet connection and try again'];
      errorFlashMessage(message);
    });
};

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.style.display = 'block';
  const userInfo = getInputs();
  const resposeData = postsigninData(userInfo);
  displayOrders(resposeData);
});
