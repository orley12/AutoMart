const openNavBtn = document.querySelector('#open-nav');
const closeNavBtn = document.querySelector('#close-nav');

openNavBtn.addEventListener('click', () => {
  document.getElementById('side-menu').style.width = '250px';
  // document.getElementById("main").style.marginLeft = "250px";
});

closeNavBtn.addEventListener('click', () => {
  document.getElementById('side-menu').style.width = '0';
  // document.getElementById("main").style.marginLeft = "250px";
});
