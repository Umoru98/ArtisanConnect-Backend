import express from 'express';
import db from '../dbService.js';
import authenticateToken from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/book',
  authenticateToken,
  [
    body('artisan_id').isInt().withMessage('Artisan ID must be an integer'),
    body('service_id').isInt().withMessage('Service ID must be an integer'),
    body('start_time').isISO8601().toDate().withMessage('Start time must be a valid date'),
    body('end_time').isISO8601().toDate().withMessage('End time must be a valid date')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { artisan_id, service_id, start_time, end_time } = req.body;
    const user_id = req.user.id;

    try {
      const overlappingAppointment = await db('appointments')
      .where('artisan_id', artisan_id)
      .whereIn('status', ['pending', 'accepted'])
      .andWhere(function () {
        this.whereBetween('start_time', [start_time, end_time])
            .orWhereBetween('end_time', [start_time, end_time]);
      })
      .first();
    

      if (overlappingAppointment) {
        return res.status(400).json({ error: 'Artisan is not available at the requested time' });
      }

      const newAppointment = {
        user_id,
        artisan_id,
        service_id,
        start_time,
        end_time,
        status: 'pending'
      };

      const [appointmentId] = await db('appointments').insert(newAppointment);

      res.status(201).json({ message: 'Appointment booked successfully', appointmentId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;