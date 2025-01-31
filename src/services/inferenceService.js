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
      .resizeNearestNeighbor([224, 224]) // Sesuaikan ukuran jika diperlukan
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data(); // Ambil array nilai prediksi
    const confidenceScore = score[0] * 100; // Nilai prediksi pertama sebagai probabilitas Cancer

    let result, suggestion;

    if (confidenceScore > 50) {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    } else {
      result = "Non-cancer";
      suggestion = "Penyakit kanker tidak terdeteksi.";
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
