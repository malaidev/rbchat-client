import { APIClient } from '../helpers/apiClient';
import fileDownload from 'js-file-download';
import JsFileDownloader from 'js-file-downloader';

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

export const downloadFile = (url, filename) => {
  //return new Promise((resolve, reject) => {
    // new APIClient().download('url')
    //   .then(res => {
    //     fileDownload(res.data, filename);
    //     resolve();
    //   })
    //   .catch(reject);
    // }
    new JsFileDownloader({ 
      url: url,
      filename: filename,
      autoStart: true,
    })
    .then(function () {
      // Called when download ended
    })
    .catch(function (error) {
      // Called when an error occurred
    });
}

export default {
  getAllData,
  uploadFile
};