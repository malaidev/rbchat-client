
import config from "./../config";
import io from 'socket.io-client';
import {getLoggedInUser} from './authUtils';

const user = getLoggedInUser();
const token = user?user.token:"";

const socket = io(config.API_URL, {
  query: 'token=' + token,
  forceNew: true
});

export default socket;