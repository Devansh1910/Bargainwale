const buyerSchema = new mongoose.Schema({
    buyer:{
        type:String,
        required:true,
    },
    buyerCompany:{
      type: String,
      required:true,

    },
    buyerdeliveryAddress: {
        addressLine1: {
          type: String,
          required: function () {
            return this.deliveryOption === "Delivery";
          },
        },
        addressLine2: {
          type: String,
        },
        city: {
          type: String,
          required: function () {
            return this.deliveryOption === "Delivery";
          },
        },
        state: {
          type: String,
          required: function () {
            return this.deliveryOption === "Delivery";
          },
        },
        pinCode: {
          type: String,
          required: function () {
            return this.deliveryOption === "Delivery";
          },
        },
      },
    buyerContact: {
        type: String,
        required: true,
    },
    buyerEmail:{
      type: String,
      required:true,
    },
    buyerGstno:{
      type: String,
      required:true,
    },
    buyerGooglemaps:{
      type: String,
    },

});