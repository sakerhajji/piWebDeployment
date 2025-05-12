const mongoose = require("mongoose");
const { string } = require("yup");

const OrderSchema = new mongoose.Schema({
    userid: { 
        type: String, 
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    items: {
        type: [
          {
            courseId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Course",
              required: true
            },
            quantity: {
              type: Number,
              required: true,
              min: 1,
              default: 1
            },
            price: {
              type: Number,
              required: true,
              min: 0
            },
      
        certificate: {
          type: Boolean,
          required: false,
          default: false
        }
          }
        ],
        validate: {
          validator: function(items) {
            return items.length > 0;
          },
          message: 'Order must include at least one course item.'
        }
      }
      ,
    payment: {
        type: Boolean,
        ref: "Payment",
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    couponCode: {
        type: String,
        maxlength: 20,
        default: null
      }
      ,
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100, 
      }
      
      
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for subtotal calculation
OrderSchema.virtual('subtotal').get(function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

module.exports = mongoose.models.Orders || mongoose.model("Orders", OrderSchema);

