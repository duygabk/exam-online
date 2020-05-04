import axios from 'axios';
import { USER_TOKEN, BASE_URL } from '../constants';

function axiosRequest(options) {
  let header = new Headers({
    "Content-Type": "application/json",
    "Charset": "UTF-8" 
  });
  const token = localStorage.getItem(USER_TOKEN);

  if (token) {
    header.append("Authoziration", "Bearer " + token);
  }

  options = Object.assign({}, options, header);

  return axios(options);
}

export function getAllUser() {
  return axiosRequest({
    method: "get",
    url: `${BASE_URL}/users/getall`,
  })
}

export function postLogin(user) {
  return axiosRequest({
    method: "post",
    url: `${BASE_URL}/users/login`,
    data: {user: JSON.stringify(user)}, 
  })
}

export function loginWithToken() {
  const token = localStorage.getItem(USER_TOKEN);
  return axiosRequest({
    method: "post",
    url: `${BASE_URL}/users/me`,
    data: {token: JSON.stringify(token)},
  })
}


