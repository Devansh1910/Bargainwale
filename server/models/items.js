import { v4 as uuidv4 } from 'uuid';
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    packaging: {
        type: String,
        enum: ['box', 'tin',''],
        default: 'box',
    },//id
    
    type: {
        type: String,
    },
    weight: {
        type: Number,
        required: true,
    },
    staticPrice: {
        type: Number,
        required: true,
    },
    itemId: {
        type: String,
        unique: true,  // This makes the itemId field unique
        default: uuidv4, 
    },
    
    
});