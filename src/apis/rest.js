import { APIClient } from '../helpers/apiClient';

function getAllData() {
  return new Promise((resolve, reject) => {
    new APIClient().get('/api/all')
      .then(resolve)
      .catch(console.log);
  });
}

export default {
  getAllData
};