import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import db from '../dbService.js';
import authenticateToken from '../middlewares/auth.js';
dotenv.config();

const router = express.Router();

router.post(
  '/register',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('service_id').isInt().withMessage('Service ID must be a valid integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { first_name, last_name, email, password, service_id } = req.body;
    try {
      const existingArtisan = await db('artisans').where({ email }).first();
      if (existingArtisan) {
        return res.status(400).json({ error: 'Artisan already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [artisanId] = await db('artisans').insert({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        service_id
      });
      
      res.status(201).json({
        message: 'Artisan successfully registered',
        artisanId,
        service_id
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Artisan Login Endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, password } = req.body;
    try {
      const artisan = await db('artisans').where({ email }).first();
      if (!artisan) return res.status(400).json({ error: 'Invalid credentials' });
      
      const validPass = await bcrypt.compare(password, artisan.password);
      if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });
      
      const token = jwt.sign(
        { id: artisan.id, email: artisan.email, role: 'artisan' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);


// Endpoint to List All Artisans
router.get('/', async (req, res) => {
  try {
    const artisans = await db('artisans')
      .join('services', 'artisans.service_id', 'services.id')
      .select(
        'artisans.id',
        'artisans.first_name',
        'artisans.last_name',
        'services.name as service'
      );
    res.json({ artisans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Endpoint to List Artisans by Service
router.get('/service/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await db('services').where({ id: serviceId }).first();
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const artisans = await db('artisans')
      .join('services', 'artisans.service_id', 'services.id')
      .where('services.id', serviceId)
      .select(
        'artisans.id',
        'artisans.first_name',
        'artisans.last_name',
        'services.name as service'
      );
    
    res.json({ artisans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Endpoint for Artisans to Accept or Decline a Booking
router.patch(
  '/appointments/:appointmentId',
  authenticateToken,
  [
    body('status')
      .isIn(['accepted', 'declined', 'completed'])
      .withMessage('Status must be accepted, declined, or completed')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });
    
    const { appointmentId } = req.params;
    const { status } = req.body;
    
    try {
      const appointment = await db('appointments').where({ id: appointmentId }).first();
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      
      if (Number(appointment.artisan_id) !== Number(req.user.id)) {
        return res.status(403).json({ error: 'You are not authorized to update this appointment' });
      }
      
      if (appointment.status === 'declined') {
        return res.status(400).json({ error: 'Appointment has already been declined and cannot be updated' });
      }
      
      if (appointment.status === 'accepted' && status === 'accepted') {
        return res.status(400).json({ error: 'Appointment is already accepted; you can only change it to declined or completed.' });
      }
      
      await db('appointments')
        .where({ id: appointmentId })
        .update({ status: status, updated_at: db.fn.now() });
      
      res.json({ message: `Appointment ${status}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);



// Endpoint for artisans to view all their appointments
router.get('/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await db('appointments')
      .where({ artisan_id: req.user.id })
      .select('id', 'user_id', 'service_id', 'start_time', 'end_time', 'status');
    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
