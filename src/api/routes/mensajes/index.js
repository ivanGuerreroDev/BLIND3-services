var express = require('express');
var router = express.Router();
var token = require('../../middlewares/token');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Friendlist = mongoose.model('Friendlist');




router.post('/findFriend', /*token,*/ function(req, res, next){

    User.findOne({email:req.body.email}, function(err,user){
        if(err){ res.send({sucess:false, msg:'No se encontro usuario'});
        }else{
            res.send({success:true, user: user});
        }
    });
});
router.post('/addFriend', /*token,*/ function(req, res, next){
    Friendlist.findOne({username:req.body.username}, function(err2,friendlist){
        if(err2){
            res.send({sucess:false, msg:'Solicitud invalida'});
        }else{
            friendlist.friends.push(req.body.friend);
            friendlist.save();
            res.send({sucess:true, msg:'Amigo agregado!'});
        }
    }); 
});

router.post('/friendList', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.username}, function(err,user){
        if(err){
            res.send({sucess:false, msg:'No se encontro usuario'});
        }else{
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    res.send({sucess:false, msg:'Solicitud invalida'});
                }else{
                    res.send({sucess:true, list:friendlist.friends});
                }
            });    
        }
    });
});

router.post('/removeFriend', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.friend}, function(err,user){
        if(err){
            res.send({sucess:false, msg:'No se encontró usuario'});
        }else{
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    res.send({sucess:false, msg:'Solicitud invalida'});
                }else{
                    tempFriendlist = arrayRemove(friendlist.friends, user.username);
                    friendlist.friends = tempFriendlist;
                    friendlist.save();
                    res.send({sucess:true, msg:'Eliminado!'});
                }
            });    
        }
    });
});

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
 }

module.exports = router;