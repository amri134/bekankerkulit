const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const { v4: uuidv4 } = require('uuid');

async function predictClassification(model, image) {
  if (image.length > 1000000) {
    throw new InputError("Payload content length greater than maximum allowed: 1000000");
  }

  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    let result, suggestion;

    if (confidenceScore > 50) {
      result = "Non Cancer";
      suggestion = "Segera periksa ke dokter!";
    } else {
      result = "Non Cancer";
      suggestion = "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka, atau berdarah.";
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result,
      suggestion,
      createdAt,
    };

    return { confidenceScore, result, suggestion, id, createdAt };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
