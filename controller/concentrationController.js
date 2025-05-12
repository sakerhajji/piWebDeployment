const Concentration = require("../models/Concentration");

async function saveOrUpdateConcentration(req, res) {
  const { userId, videoId, concentration } = req.body;

  try {
    const updated = await Concentration.findOneAndUpdate(
      { userId, videoId },
      { concentration },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'Concentration enregistrée', data: updated });
  } catch (error) {
    console.error('Erreur de sauvegarde :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
module.exports = { saveOrUpdateConcentration };