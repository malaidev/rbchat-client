import axios from 'axios';
import config from "./../config";
import {getLoggedInUser, removeLoggedInUser} from './authUtils';

// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// intercepting to capture errors
axios.interceptors.response.use(function (response) {
  if (response.status === 250)
    return Promise.reject(response.data.message);
  return response.data ? response.data : response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  let message = error.message || error;
  if (!error.response)
    return Promise.reject(message);
    
  switch (error.response.status) {
      case 500: message = 'Internal Server Error'; break;
      case 401: 
        message = 'Invalid credentials';
        removeLoggedInUser();
        window.location="/";
        break;
      case 404: message = "Sorry! the data you are looking for could not be found"; break;
      default: message = error.message || error;
  }
  return Promise.reject(message);
});

/**
 * Sets the default authorization
 * @param {*} token 
 */
const setAuthorization = (token) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}


class APIClient {

    constructor() {
      const user = getLoggedInUser();
      if (user) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      }
      else {
        axios.defaults.headers.common['Authorization'] = null;
      }
    }
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        return axios.get(url, params);
    }

    /**
     * Fetches data from given url
     */
    download = (url) => {
      const headers = {
        responseType: 'blob'
      };
      return axios.get(url, {headers})
    }

    /**
     * post given data to url
     */
    post = (url, data) => {
        return axios.post(url, data);
    }

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.patch(url, data);
    }

    /**
     * Delete 
     */
    delete = (url) => {
        return axios.put(url);
    }
}

export { APIClient, setAuthorization };