const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const CategorySchema = new Schema({
        TYPE: String,
        Group: String,
        name:{
            type: String,
            unique: true,
        },
        img: String,
        imgs : Array,
        price: Number,
        quantity: Number,
        description: Array,
        id_category: mongoose.Schema.Types.ObjectId,
        status: {
            type: Boolean,
            default: false
        }
 });
 //tao collection
 module.exports = mongoose.model('category', CategorySchema);


