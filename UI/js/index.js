/* eslint-disable no-plusplus */
const carId = JSON.parse(localStorage.getItem('carId'));
console.log(parseInt(carId, 10));

const url = `http://localhost:8081/api/v1/car/${carId}/flag`;

const bodyTypeViews = document.getElementsByClassName('body-type-img');
const manufacturerViews = document.getElementsByClassName('make');
const searchButton = document.querySelector('#search-button');
const make = document.querySelector('.index-make');
const bodytype = document.querySelector('.index-body');
const state = document.querySelector('.index-state');
const contactForm = document.querySelector('#form-contact');
const titleContact = document.querySelector('#title-contact');
const messageContact = document.querySelector('#message-contact');
const unorderedlist = document.querySelector('.notification-list');
const notification = document.querySelector('.notification');
notification.style.display = 'none';

const getInputs = () => ({ reason: titleContact.value, description: messageContact.value });

const postInputs = input => fetch(url, {
  method: 'post',
  mode: 'cors',
  body: JSON.stringify(input),
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
      if (responseJson.status === 200) {
        flashMessage('Message succesfully sent');
      } else {
        errorFlashMessage(responseJson.errors);
      }
    }).catch(() => {
      const message = 'Error in connecting, Please check your internet connection and try again';
      flashMessage(message);
    });
};

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.style.display = 'block';
  const input = getInputs();
  const resposeData = postInputs(input);
  displayData(resposeData);
});


const getQueryParams = () => {
  const queryParams = [];
  const makeParam = make.options[make.selectedIndex].value;
  const bodytypeParam = bodytype.options[bodytype.selectedIndex].value;
  const stateParam = state.options[state.selectedIndex].value;
  if (makeParam) {
    queryParams.push(`manufacturer=${makeParam}`);
  }
  if (bodytypeParam) {
    queryParams.push(`body_type=${bodytypeParam}`);
  }
  if (stateParam) {
    queryParams.push(`state=${stateParam}`);
  }
  return queryParams;
};

searchButton.addEventListener('click', () => {
  const queryParams = getQueryParams();
  localStorage.setItem('query', JSON.stringify(queryParams));
  window.location = 'vehicles.html';
});

for (let i = 0; i < bodyTypeViews.length; i++) {
  bodyTypeViews[i].addEventListener('click', (e) => {
    const query = e.currentTarget.querySelector('h1').innerHTML;
    const queryArray = [`body_type=${query.toLowerCase()}`];
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
