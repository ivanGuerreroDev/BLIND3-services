var express = require('express');
var router = express.Router();
var token = require('../../middlewares/token');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Friendlist = mongoose.model('Friendlist');
var FriendRequest = mongoose.model('FriendRequest');



router.post('/findFriend', /*token,*/ function(req, res, next){
    var username = req.body.username;
    var email = req.body.email;
    User.findOne({email:email}, function(err,user){
        if(err){ return res.send({sucess:false, msg:'No se encontro usuario'});
        }else{
            Friendlist.findOne({username: username}, function(err,row){
                if(err){return res.send({success:true, user: user});}
                if(row != null){
                    if( !(row.friends.find(friend => friend.username === user.username)) ){
                        return res.send({success:true, user: user});
                    }else{
                        return res.send({success:false, msg: 'Usuario ya esta en tu lista de amigos'});
                    }
                }
            })
        }
    });
    
});
router.post('/addFriend', /*token,*/ function(req, res, next){
    FriendRequest.findOne({username:req.body.friend, request: req.body.username}, function(err,rows){
        if(err){
            return res.send({sucess:false, msg:'Error'});
        }else if(rows.length){
            Friendlist.findOne({username: req.body.username},function(err2,rows2){
                if(err2){return res.send({sucess:false, msg:'Error'});}
                friendlist.friends.push(req.body.friend);
                friendlist.save();
            })
            Friendlist.findOne({username: req.body.friend},function(err2,rows2){
                if(err2){return res.send({sucess:false, msg:'Error'});}
                friendlist.friends.push(req.body.username);
                friendlist.save();
            })
            return  res.send({sucess:true, msg:'Amigo agregado!'});
        }else{
            return res.send({sucess:false, msg:'Error'});
        }
    }); 
});

router.post('/sendRequest', /*token,*/ function(req, res, next){
    FriendRequest.findOne({username:req.body.username, request: req.body.request}, function(err,rows){
        if(err){
            return res.send({sucess:false, msg:'Error'});
        }else if(rows){
            return res.send({sucess:true, msg:'Solicitud enviada'});
            
        }else{
            newRequest = new FriendRequest();
            newRequest.username = req.body.username;
            newRequest.request = req.body.request;
            newRequest.save(function (err2) {
                if(err2){
                    return res.send({message:err2,success:false});
                }else{
                    return res.send({sucess:true, msg:'Solicitud enviada'});
                }
            })
            
        }
    }); 
});

router.post('/friendList', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.username}, function(err,user){
        if(err){
            return res.send({sucess:false, msg:'No se encontro usuario'});
        }else{
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    return res.send({sucess:false, msg:'Solicitud invalida'});
                }else{
                    return res.send({sucess:true, list:friendlist.friends});
                }
            });    
        }
    });
});

router.post('/removeFriend', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.friend}, function(err,user){
        if(err){
            return res.send({sucess:false, msg:'No se encontró usuario'});
        }else{
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    return res.send({sucess:false, msg:'Solicitud invalida'});
                }else{
                    tempFriendlist = arrayRemove(friendlist.friends, user.username);
                    friendlist.friends = tempFriendlist;
                    friendlist.save();
                    return res.send({sucess:true, msg:'Eliminado!'});
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