// const url = `http://localhost:8081/api/v1/car/${carId}`;
// const urlPrice = `http://localhost:8081/api/v1/car/${carId}/price`;
// const urlStatus = `http://localhost:8081/api/v1/car/${carId}/status`;

// const price = document.querySelector('#price');
// const status = document.querySelector('#status');
// const updateForm = document.querySelector('#update-price-form');
// const unorderedlist = document.querySelector('.notification-list');
// const notification = document.querySelector('.notification');
// notification.style.display = 'none';

// let statusValue = '';

// status.addEventListener('change', () => {
//   if (this.checked) {
//     statusValue = 'sold';
//   } else if (!this.checked) {
//     statusValue = 'unsold';
//   }
// });

// const getInputs = () => ({
//   price: price.value,
//   status: statusValue,
// });

// const postsigninData = () => fetch(url, {
//   method: 'get',
//   mode: 'cors',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-access-token': localStorage.getItem('token'),
//   },
// });

// const successFlashMessage = (message) => {
//   const listItem = document.createElement('li');
//   const text = document.createTextNode(message);
//   listItem.appendChild(text);
//   if (unorderedlist.childNodes.length > 0) {
//     unorderedlist.innerHTML = '';
//   }
//   unorderedlist.appendChild(listItem);
// };

// const errorFlashMessage = (messages) => {
//   messages.forEach((message) => {
//     const listItem = document.createElement('li');
//     const text = document.createTextNode(message.msg);
//     listItem.appendChild(text);
//     if (unorderedlist.childNodes.length > 0) {
//       unorderedlist.innerHTML = '';
//     }
//     unorderedlist.appendChild(listItem);
//   });
// };

// const displayData = (data) => {
//   data.then(respose => respose.json())
//     .then((responseJson) => {
//       if (responseJson.status === 200) {
//         setTimeout(() => {
//           window.location = 'index.html';
//         }, 15000);
//         successFlashMessage(responseJson.message);
//       } else {
//         errorFlashMessage(responseJson.errors);
//       }
//     }).catch(() => {
//       const message = ['Error in connecting, Please check your internet connection and try again'];
//       errorFlashMessage(message);
//     });
// };

// updateForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   notification.style.display = 'block';
//   const userInfo = getInputs();
//   const resposeData = postsigninData(userInfo);
//   displayData(resposeData);
// });
