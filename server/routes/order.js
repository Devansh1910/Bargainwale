import { Router } from 'express';
import orderController from '../controllers/order.js';

const router = Router();

router.post('/api/order', orderController.createOrder);
router.get('/api/order', orderController.getAllOrders);
router.get('/api/order/:id', orderController.getOrderById);
router.put('/api/order/:id', orderController.updateOrder);
router.put('/api/order/:id/bill-type', orderController.updateBillTypePartWise);

export default router;