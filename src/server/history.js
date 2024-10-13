const { Firestore } = require('@google-cloud/firestore');

async function getPredictHistories(request, h) {
  const db = new Firestore();

  try {
    const predictCollection = db.collection('Predictions');
    const snapshot = await predictCollection.get();

    const histories = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        history: {
          result: data.label,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
          id: doc.id,
        },
      });
    });

    return {
      status: 'success',
      data: histories,
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to retrieve prediction histories',
    }).code(500);
  }
}

module.exports = getPredictHistories;
