const express = require('express');
const router = express.Router();

const BannerModel = require('../models/banner_models');



var link = {home:'',category:'',user:'', banner:''};
router.get('/banner',(req,res)=>{
    main = 'Slide_managerment/slide_banner';
    link.banner = 'active';
    BannerModel.find({status: false})
    .exec((err,data)=>{
        if(err)
        {
            res.send({kq: 0, err: err})
        }
        else
        {
            str ='';
                // data.forEach((v)=>{
                //     str +=  `<tr id="`+v._id+`">
                //                 <td>`+v.name+`</td>
                //                 <td>`+v.TYPE+`</td>
                //                 <td>`+v.Group+`</td>
                //                 <td><img src="/public/uploads/uploads/`+v.img+`" alt="`+v.img+`"></td>
                //                 <td>`+v.price+`</td>
                //                 <td>`+v.quantity+`</td>
                //                 <td>`+v.description+`</td>
                //                 <td>
                //                     <button class="btn btn-info btn-adjust edit_product"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-pencil-alt""></i></button>
                //                     <button type="button" class="btn btn-danger btn-adjust delete_product_tmp"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fas fa-trash-alt"></i></button>
                //                 </td>
                //             </tr>`
                // });
            
            res.render('index', {main: main, str:str,link: link});
        }
    });

});

module.exports = router; 