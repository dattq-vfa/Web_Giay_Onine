const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const CategorySchema = new Schema({

        class:{
            type: String,
            unique: true,
        },
        group: {
            type: String,
            unique: true,
        },
        name:{
            type: String,
            unique: true,
        },
        img: String,
        imgs : Array,
        price: Int16Array,
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


