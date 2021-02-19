import { APIClient } from '../helpers/apiClient';

export const getAllData = () => {
  return new Promise((resolve, reject) => {
    new APIClient().get('/api/all')
      .then(resolve)
      .catch(reject);
  });
}

export const uploadFile = (file, messageObj) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    for (const [key, value] of Object.entries(messageObj))
      fd.append('message['+ key +']', value);
    new APIClient().post('/api/file', fd)
      .then(resolve)
      .catch(reject);
  });
}

export default {
  getAllData,
  uploadFile
};