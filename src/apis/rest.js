import { APIClient } from '../helpers/apiClient';

export const getAllData = () => {
  return new Promise((resolve, reject) => {
    new APIClient().get('/api/all')
      .then(resolve)
      .catch(reject);
  });
}

export default {
  getAllData
};