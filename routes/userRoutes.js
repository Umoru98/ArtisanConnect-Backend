import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../dbService.js';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().notEmpty().withMessage('Enter a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required').isMobilePhone('any').withMessage('Enter a valid phone number'),
  body('password').notEmpty().withMessage('Password is required').isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1}).withMessage('Passord must be at least 8 characters long and must include uppercase, lowercase, number and symbol')
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, phone, password } = req.body;


  try {
    const existingUser = await db('users').where({email}).orWhere({phone}).first();
    if(existingUser) {
      return res.status(400).json({msg: 'User already exists'})
    }
    const hashedPssword = await bcrypt.hash(password, 10);
    const [userId] = await db('users').insert({first_name, last_name, email, phone, password: hashedPssword});
    res.status(201).json({msg: 'Registration successful', userId});
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: 'Internal server error'});
  }
});


router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
],
async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try{
    const user = await db('users').where({email}).first();
    if(!user) {
      return res.status(400).json({msg: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({msg: 'Invalid credentials'});
    }

    const token = jwt.sign({id: user.id, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    res.status(200).json({msg: 'Login successful', token});
  }
  catch(error) {
    console.error(error);
    res.status(500).json({msg: 'Internal server error'});
  }
})

export default router;