const express = require('express');
const router = express.Router();

var fs = require('fs');
//load multer
const multer = require('multer');
const CategoryModel = require('../models/category_models');
//goi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./cratch');
//cau hinh bien
let path=[];
let link_avatar ='';
let link_items =[] ;
let dif_name='';
//cau hinh luu file
const storage = multer.diskStorage({
    //duong dan luu file
    destination: (req,file,cb)=>{
        cb(null,'public/uploads/uploads');
    },
    //kiem tra file
    filename: (req,file,cb)=>{
        if(file.mimetype != 'image/jpeg'&&file.mimetype != 'image/png')
        {
            return cb('File khong dung dinh dang');
        }
        else
        {
            CategoryModel.find({name: req.body.name})
            .exec((err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(data.length<1 || req.body.e_form == 'e_form')
                    {
                        // file.fieldname +  upload.any() để lấy tên file hình
                        if(file.fieldname == 'img')
                        {
                            let path_img ='avatar'+ '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_avatar = path_img;
                            path.push("avatar");
                        }
                        else
                        {
                            let path_img ='item'+ '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_items.push(path_img);
                            path.push("items");
                        }
                    }
                    else 
                    {
                        dif_name = 'err';
                    }
                }
            });
        }
    }
});

var limits = {fileSize: 1024*5000}; // hieu la 200kb
// Gọi ra sử dụng
var upload = multer({storage: storage, limits: limits });

router.post('/upload_file',(req,res)=>{
    if(dif_name != 'err')
    {
        // upload image and handle err
        upload.any()(req, res, function(err){
            if(path.length < 1) 
            {
                res.send('No choosed Image');
            }
            else if(err instanceof multer.MulterError)
            {
                (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
            }
            else if(err) 
            {
                res.send(err);
            }
            else
            {
                if(path.indexOf("avatar") == -1) res.send("No choosed Image Avatar");
                else if(path.indexOf("items") == -1) res.send("No choosed Image Items");
                else 
                {
                    obj = [
                        {
                            TYPE: req.body.TYPE,
                            Group: req.body.Group,
                            name: req.body.name,
                            price: req.body.price,
                            quantity: req.body.quantity,
                            description: req.body.content[1],
                            img: link_avatar,
                            imgs: link_items,
                            id_category: localStorage.getItem('id_user')
                        }
                    ];
                    CategoryModel.create(obj,(err,data_token)=>{
                        if(err)
                        {
                            res.send('err create token');
                        }
                        else
                        {
                            res.send("ok");
                        }
                    });
                }
            }
            path =[];
        });
    }
    else
    {
        dif_name='';
        res.send('Name already exists');
    }
});

router.post('/edit_file',(req,res)=>{
    upload.any()(req, res, function(err){
        let data_img = req.body.name_img.split(',');
        console.log(data_img);
        if(err instanceof multer.MulterError)
        {
            (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
        }
        else if(err) 
        {
            res.send(err);
        }
        else
        {
            delete_img(data_img,'avatar');
            delete_img(data_img,'item');
            res.send("ok");
        }
//         obj =  { 
//             TYPE: req.body.TYPE,
//             Group: req.body.Group,
//             name: req.body.name,
//             price: req.body.price,
//             quantity: req.body.quantity,
//             img: link_avatar,
//             description: req.body.content[1],
//             id_category: localStorage.getItem('id_user')
//         };
// CategoryModel.updateMany({ _id: req.body.id },obj,(err,data)=>{
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         res.send('Completed!')
//     }
// });
    });
});

router.get('/add_categories',(req,res)=>{
    main = 'categories/add_category_product';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.get('/list_categories',(req,res)=>{
    main = 'categories/list_category_product';
    CategoryModel.find({status: false })
    .exec((err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            str ='';
            data.forEach((v)=>{
                str += `<tbody id="`+v._id+`">
                            <tr>
                            <td>`+v.name+`</td>
                            <td>`+v.TYPE+`</td>
                            <td>`+v.Group+`</td>
                            <td><img src="/public/uploads/uploads/`+v.img+`" alt="`+v.img+`"></td>
                            <td>`+v.price+`</td>
                            <td>`+v.quantity+`</td>
                            <td>`+v.description+`</td>
                            <td>
                                <button class="btn btn-info btn-adjust edit_product"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fa fa-pencil" style="padding:0px 5px"></i></button>
                                <button type="button" class="btn btn-danger btn-adjust delete_product_tmp"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fa fa-trash" style="padding:0px 5px"></i></button>
                            </td>
                            </tr>
                        </tbody>`
            });
            res.render('index',{main:main,str:str});//gui du lieu khi su dung ejs
        }
    });
});

router.get('/list_categories/list_delete',(req,res)=>{
    main = 'categories/list_category_product';
    CategoryModel.find({status: true })
    .exec((err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            str ='';
            data.forEach((v)=>{
                str += `<tbody id="list_delete`+v._id+`">
                            <tr>
                            <td>`+v.name+`</td>
                            <td>`+v.TYPE+`</td>
                            <td>`+v.Group+`</td>
                            <td>`+v.img+`</td>
                            <td>`+v.price+`</td>
                            <td>`+v.quantity+`</td>
                            <td>`+v.description+`</td>
                            <td>
                                <button class="btn btn-info btn-adjust restore_product"><span style="display:none;">`+JSON.stringify(v._id)+`</span>Restore</button>
                                <button type="button" class="btn btn-outline-danger btn-adjust list_delete_product"><span style="display:none;">`+JSON.stringify(v)+`</span>Delete</button>
                            </td>
                            </tr>
                        </tbody>`
            });
            res.render('index',{main:main,str:str});//gui du lieu khi su dung ejs
        }
    });
});

router.post('/update_status_product',(req,res)=>{
    id = req.body.id;
    obj =  { status: true };
    CategoryModel.updateMany({ _id: id },obj,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send('da xoa')
            }
    });
});

router.post('/restore_product',(req,res)=>{
    id = req.body.id;
    obj =  { status: false };
    CategoryModel.updateMany({ _id: id },obj,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send('Done!')
            }
    });
});

router.post('/delete_product',(req,res)=>{
    id = req.body.id;
    CategoryModel.findByIdAndDelete({ _id: id},(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send('da xoa')
        }
    });
})

module.exports = router; //xuat ra du lieu de su dung

// router.post('/SHOW_IMG',(req,res)=>{
//     let c =[];
//     fs.readdirSync("./public/uploads/uploads").forEach(file => {
//         c.push("/public/uploads/uploads/"+file);
//     });
//     res.send(c);
// })
function delete_img(data,key_data){
    for(i in data)
    {
        if(data[i].includes(key_data))
        {
            fs.unlink('./public/uploads/uploads/'+ data[i], function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        }
    }  
}