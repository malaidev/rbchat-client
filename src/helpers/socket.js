
import config from "./../config";
import io from 'socket.io-client';

const socket = io(config.API_URL);

export default socket;