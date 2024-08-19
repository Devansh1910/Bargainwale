import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    packaging: {
        type: String,
        enum: ['box', 'tin'],
        default: 'box',
    },
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
    quantity: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    companyBargainDate: {
        type: Date,
        required: true,
    },
    
    items: [itemSchema],  // Changed from single item to an array of items
    
    companyBargainNo: {
        type: String,
        required: true,
    },
    sellerName:{
        type:String,
        required:true,
    },
    sellerLocation: {
        type: String,
        required: true,
    },
    sellerContact: {
        type: String,
        required: true,
    },
    billType: {
        type: String,
        enum: ['Virtual Billed', 'Billed'],
        default: 'Virtual Billed',
    },
    status:{
        type: String,
        enum:['created','payment pending','billed', 'completed'],
        default:'created',
    },
    description: {
        type: String,
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true,
    },
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    transportType: {
        type: String,
        required: true,
    },
    transportLocation:{
        type:String,
        required:true,
    },
}, { timestamps: true });

function daysBetweenDates(companyBargainDate, currentDate) {
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    const date1Ms = new Date(companyBargainDate).getTime();
    const date2Ms = new Date(currentDate).getTime();

    const differenceMs = Math.abs(date2Ms - date1Ms);
    return Math.floor(differenceMs / oneDay);
};

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
    return daysBetweenDates(this.createdAt, new Date());
};

// Method to calculate days since creation
orderSchema.methods.getDaysSinceCreation = function () {
    const now = new Date();
    const days = Math.ceil((now - this.createdAt) / (1000 * 60 * 60 * 24));
    return days;
};


// Method to determine if popup should appear
orderSchema.methods.shouldShowPopup = function () {
    const daysSinceCreation = this.getDaysSinceCreation();
    if (this.status === 'payment pending') {
        return daysSinceCreation >= 10;
    }
    if (this.status === 'created') {
        return daysSinceCreation >= 15;
    }
    return false;
};

// orderSchema.post('save', async function (doc, next) {
//     try {
//         const { item, quantity, weightInMetrics, organization } = doc;

//         let inventoryItem = await Inventory.findOne({
//             'item.type': item.type,
//             'item.category': item.category,
//             'item.oilType': item.oilType,
//             organization
//         });

//         if (inventoryItem) {
//             inventoryItem.quantity += quantity;
//             inventoryItem.weightInMetrics += weightInMetrics;
//             await inventoryItem.save();
//         } else {
//             inventoryItem = new Inventory({
//                 item,
//                 quantity,
//                 weightInMetrics,
//                 organization
//             });
//             await inventoryItem.save();
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

const Order = mongoose.model('Order', orderSchema);
export default Order;