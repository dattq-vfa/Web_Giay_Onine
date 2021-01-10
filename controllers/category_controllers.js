const express = require('express');
const router = express.Router();

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
                    if(data.length<1)
                    {
                        // file.fieldname +  upload.any() để lấy tên file hình
                        if(file.fieldname == 'img')
                        {
                            let path_img ='avatar'+ '-' +  req.body.name + '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_avatar = path_img;
                            path.push("avatar");
                        }
                        else
                        {
                            let path_img ='item'+ '-' + req.body.name + '-' + Date.now() + '-' + file.originalname;
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
                            description: req.body.content,
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

router.post('/SHOW_IMG',(req,res)=>{
    let c =[];
    fs.readdirSync("./public/uploads/uploads").forEach(file => {
        c.push("/public/uploads/uploads/"+file);
    });
    res.send(c);
})

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
                            <td>`+v.img+`</td>
                            <td>`+v.price+`</td>
                            <td>`+v.quantity+`</td>
                            <td>`+v.description[1]+`</td>
                            <td>
                                <button  class="btn btn-info btn-adjust">Sửa</button>
                                <button type="button" class="btn btn-outline-danger btn-adjust" data-toggle="modal" data-target="#myModal`+v._id+`">Xóa</button>
                            </td>
                            </tr>
                        </tbody>`
                str += `<div class="modal" id="myModal`+v._id+`">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <!-- Modal Header -->
                                    <div class="modal-header">
                                        <h4 class="modal-title">Thông báo</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <!-- Modal body -->
                                    <div class="modal-body">
                                        Bạn có muốn xóa `+v.name+` không?
                                    </div>
                                    <!-- Modal footer -->
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="delete_data('`+v._id+`')">Xóa ngay</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal">Thoát</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
            });
            res.render('index',{main:main,str:str});//gui du lieu khi su dung ejs
        }
    });
});

router.get('/list_categories/edit/:id',(req,res)=>{
    console.log(req.params.id);
    // link = '/user'
    // main = 'users/edit';
    CategoryModel.find({_id : req.params.id})
    .exec((err,data)=>{
        console.log(data[0]);
        // res.render('index',{main: main,data: data[0]});

    });
})

// router.get('/Add_Category',(req,res)=>{
//     main = 'categories/edit_category_product';
//     res.render('index',{main:main});
// })


module.exports = router; //xuat ra du lieu de su dung