const mongoose = require('mongoose');

const Schema = mongoose.Schema;

 const BannerSchema = new Schema({
        img: String,
        stt : String,
        id_category: mongoose.Schema.Types.ObjectId,
        status: {
            type: Boolean,
            default: false
        }
 });
 //tao collection
 module.exports = mongoose.model('banner', BannerSchema);


