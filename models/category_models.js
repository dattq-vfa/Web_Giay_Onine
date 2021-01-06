const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const CategorySchema = new Schema({

        TYPE:{
            type: String,
            unique: true,
        },
        Group: {
            type: String,
            unique: true,
        },
        name:{
            type: String,
            unique: true,
        },
        img: String,
        imgs : Array,
        price: Number,
        discription: String,
        link:{
            type: String,
            unique: true,
        },
        id_user: mongoose.Schema.Types.ObjectId,
        status: {
            type: Boolean,
            default: false
        }
 });
 //tao collection
 module.exports = mongoose.model('category', CategorySchema);


