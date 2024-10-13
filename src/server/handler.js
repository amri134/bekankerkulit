const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const InputError = require('../exceptions/InputError');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    if (!image) {
      throw new InputError("Image is required");
    }

    const predictionResult = await predictClassification(model, image);
    
    await storeData(predictionResult.id, predictionResult);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data: predictionResult,
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error instanceof InputError) {
      const response = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
    response.code(500);
    return response;
  }
}

module.exports = postPredictHandler;
