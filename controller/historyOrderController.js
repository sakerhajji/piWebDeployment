const HistoryOrder = require('../models/HistoryOrder');

exports.getHistoryByUserId = async (req, res) => {
  try {
    const { userid } = req.params;

    const history = await HistoryOrder.find({ userid })
      .populate('items.courseId', 'title description courseImage price')
      .sort({ completedAt: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No history orders found for this user' });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error('❌ Error fetching history orders:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
