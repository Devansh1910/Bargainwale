import { Router } from 'express';

import bookingController from "../controllers/booking.js";


const router = Router();

router.post('/api/booking', bookingController.createBooking);
router.get('/api/booking', bookingController.getAllBookings);
router.get('/api/booking/:id', bookingController.getBookingById);
router.put('/api/booking/:id', bookingController.updateBooking);
router.delete('/api/booking/:id', bookingController.deleteBooking);

export default router;
