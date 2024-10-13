const postPredictHandler = require('../server/handler');
const getPredictHistories = require('../server/history');

const routes = [
  // Endpoint untuk memprediksi gambar
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        maxBytes: 1000000, // 1MB
        multipart: true,
      },
    },
  },
  // Endpoint untuk mengambil riwayat prediksi
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistories,
  },
];

module.exports = routes;
