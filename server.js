import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import serviceRoute from './routes/serviceRoute.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use('/api/users', userRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the Artisan booking API');
})


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));