import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse", 
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item", 
    required: true
  },
  companyPrice: {
    type: Number,
    required: true
  },
  rackPrice: {
    type: Number,
    required: true
  },
  plantPrice: {
    type: Number,
    required: true
  },
  depoPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now 
  }
}, { timestamps: true });

const Price = mongoose.model("Price", priceSchema);
export default Price;
