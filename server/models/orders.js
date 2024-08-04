import mongoose from "mongoose";
import Inventory from "./inventory";

const orderSchema = new mongoose.Schema({
    companyBargainDate: {
        type: Date,
        required: true,
    },
    currentDate: {
        type: Date,
        default: Date.now,
    },
    item: {
        type: {
            type: String,
            enum: ['oil', 'box', 'tin'],
            required: true,
        },
        category: {
            type: String,
            enum: ['box', 'tin'],
            required: function () { return this.type === 'box'; },
        },
        oilType: {
            type: String,
            enum: ['palmOil', 'vanaspatiOil', 'soybeanOil'],
            required: function () { return this.type === 'oil'; },
        },
    },
    companyBargainNo: {
        type: String,
        required: true,
    },
    location: {
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    },
    staticPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    weightInMetrics: {
        type: Number,
        required: true,
    },
    convertedWeightInGm: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['created', 'billed', 'payment pending', 'completed'],
        default: 'created',
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    billedAt: {
        type: Date,
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true,
    },
});

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
    const now = new Date();
    const days = Math.ceil((now - this.createdAt) / (1000 * 60 * 60 * 24));
    return days;
};

// Method to determine if popup should appear
orderSchema.methods.shouldShowPopup = function () {
    const daysSinceCreation = this.getDaysSinceCreation();
    if (this.status === 'created') {
        return daysSinceCreation >= 10;
    }
    if (this.status === 'billed' && this.status === 'payment pending') {
        return daysSinceCreation >= 15;
    }
    return false;
};

orderSchema.post('save', async function (doc, next) {
    try {
        const { item, quantity, weightInMetrics, convertedWeightInGm, organization } = doc;

        let inventoryItem = await Inventory.findOne({
            'item.type': item.type,
            'item.category': item.category,
            'item.oilType': item.oilType,
            organization
        });

        if (inventoryItem) {
            inventoryItem.quantity += quantity;
            inventoryItem.weightInMetrics += weightInMetrics;
            inventoryItem.convertedWeightInGm += convertedWeightInGm;
            await inventoryItem.save();
        } else {
            inventoryItem = new Inventory({
                item,
                quantity,
                weightInMetrics,
                convertedWeightInGm,
                organization
            });
            await inventoryItem.save();
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;