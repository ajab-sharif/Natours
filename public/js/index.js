/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { doc } from 'prettier';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const userDataForm = document.querySelector('.form-user-data');
const logoutEl = document.querySelector('.nav__el--logout');
const userPasswordForm = document.querySelector('.form-user-password')
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
    login(email, password);
  })
}
if (logoutEl) {
  logoutEl.addEventListener('click', () => {
    logout();
  })
}

if (userDataForm) {
  document.querySelector('.form-user-data').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form, 'data');
  })
}

if (userPasswordForm) {
  document.querySelector('.form-user-password').addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.btn--user-password').textContent = "updating.."
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    updateSettings({ currentPassword, password, passwordConfirm }, 'password');
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--user-password').textContent = "Save password";
  })
}