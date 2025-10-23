import express from 'express';
import Case from '../models/Case.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Find similar cases using keyword matching (replace with vector similarity)
router.get('/:caseId/similar', protect, async (req, res) => {
  try {
    const currentCase = await Case.findById(req.params.caseId);
    
    if (!currentCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Find cases with matching IPC tags
    const similarCases = await Case.find({
      _id: { $ne: currentCase._id },
      $or: [
        { ipcTags: { $in: currentCase.ipcTags } },
        { entities: { $in: currentCase.entities } }
      ]
    }).limit(5).select('caseNumber title ipcTags status createdAt');

    // Calculate similarity scores
    const casesWithScores = similarCases.map(case_ => {
      const ipcMatch = case_.ipcTags.filter(tag => currentCase.ipcTags.includes(tag)).length;
      const similarityScore = (ipcMatch / Math.max(currentCase.ipcTags.length, 1)) * 100;
      
      return {
        ...case_.toObject(),
        similarityScore: similarityScore.toFixed(1)
      };
    });

    res.json(casesWithScores.sort((a, b) => b.similarityScore - a.similarityScore));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
