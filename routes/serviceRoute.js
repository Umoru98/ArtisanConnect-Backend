import express from 'express';
import db from '../dbService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
