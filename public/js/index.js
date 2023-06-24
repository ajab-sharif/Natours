/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const userDataForm = document.querySelector('.form-user-data');
const logoutEl = document.querySelector('.nav__el--logout');
// DELEGATION
if (mapBox) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
};
if (loginForm) {
  document.querySelector('.form-login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('login');
    login(email, password);
  })
}
if (logoutEl) {
  logoutEl.addEventListener('click', () => {
    console.log('done');
    logout();
  })
}
//
//if (userDataForm) {
//  document.querySelector('.form-user-data').addEventListener('submit', (e) => {
//    e.preventDefault();
//    console.log('update-data');
//  })
//}