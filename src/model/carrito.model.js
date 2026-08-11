import mongoose from "mongoose";

const carritosCollection = "carritos";

const carritoSchema = new mongoose.Schema({

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productos",
                required: true
            },

            quantity: {
                type: Number,
                default: 1
            }
        }
    ],

    manualItems: [
        {
            title: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    fechaCreacion: {
        type: Date,
        default: Date.now
    }

});

const CarritoModel = mongoose.model(carritosCollection, carritoSchema);

export default CarritoModel;