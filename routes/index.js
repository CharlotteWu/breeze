var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
/*
 * GET home page.
 */

module.exports = function(app){
   
 app.get('/', function (req, res) {
   Post.getAll(null, function (err, posts) {
    if (err) {
      posts = [];
    } 
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

   app.get('/reg',checkNotLogin);
   app.get('/reg',function(req,res){
      res.render('reg',{
         title:'Regis',
         user:req.session.user,
         success:req.flash('success').toString(),
         error:req.flash('error').toString()
      });
   }); 


   app.post('/reg',checkNotLogin);
   app.post('/reg',function(req,res){
   	var name = req.body.name;
      var password = req.body.password;
      var confirm = req.body['confirm'];

      if(password != confirm){
         req.flash('error','两次密码不一致');
         req.redirect('/reg');
      }
      
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');

      var newUser = new User({
              name:name,
              password:password,
              email: req.body.email
      });

      User.get(newUser.name,function(err,user){
         if(err){
            req.flash('error','出错');
            return res.redirect('/reg');
         }

         if(user){
            req.flash('error','该用户已存在');
            return res.redirect('/reg');
         }

        newUser.save(function(err,user){
            if(err){
                 req.flash('error',err);
                 return res.redirect('/reg');
            }
            req.session.user = user;
            req.flash('success','注册成功');
            res.redirect('/');
         });
      });

   });
  

   app.get('/login',checkNotLogin);
   app.get('/login',function(req,res){
     res.render('login',{
      title:'Login',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()

     });
   });


   app.post('/login',checkNotLogin);
   app.post('/login',function(req,res){
   	 
     var md5 = crypto.createHash('md5');
     var password = md5.update(req.body.password).digest('hex');
      
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('/login'); 
    }
     
    if (user.password != password) {
      req.flash('error', '密码错误!'); 
      return res.redirect('/login'); 
    }
   
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/'); 
     });

   });
   

   app.get('/post',checkLogin);
   app.get('/post',function(req,res){
      res.render('post',{title:'Post'});
   });

   
   app.post('/post',checkLogin);
   app.post('/post',function(req,res){
      var currentUser = req.session.user;
      var post = new Post(currentUser.name , req.body.title , req.body.post);


      post.save(function(err){
        if(err){
          req.flash('error',err);
          return res.redirect('/');
        }
         
        req.flash('success','发布成功');
        return res.redirect('/');

      });

   });
   

   app.get('/logout',checkLogin);
   app.get('/logout',function(req,res){
       req.session.user = null;
       req.flash('success','登出成功');
       res.redirect('/');
   });

   

   app.get('/:name',function(req,res){
        User.get(req.params.name,function(err,user){
           if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/');
           }

           Post.getAll(user.name,function(err,posts){
              
                 if(err){
                   req.flash('error',err);
                   return res.redirect('/');
                 }
                 res.render('user',{
                    title:user.name,
                    posts:posts,
                    user:req.session.user,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
            }); 
         });
      });
   });
   

   
   app.get('/:name/:day/:title', function (req, res) {
  Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('article', {
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

   function checkLogin(req,res,next){

     if(!req.session.user){
        req.flash('error','未登录');
        res.redirect('/login');
     }

     next();
   }

   function checkNotLogin(req,res,next){

      if(req.session.user){
         req.flash('error','已登录');
         res.redirect('back');
      }
      next();
   }


};