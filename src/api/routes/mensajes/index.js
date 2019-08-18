var express = require('express');
var router = express.Router();
var token = require('../../middlewares/token');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Friendlist = mongoose.model('Friendlist');

router.post('/addFriend', /*token,*/ function(req, res, next){

    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            res.send({sucess:false, msg:'cannot find user with email'});
        }else{
            Friendlist.findOne({username:req.body.user}, function(err2,friendlist){
                if(err2){
                    res.send({sucess:false, msg:'request from invalid user'});
                }else{
                    friendlist.friends.push(user.username);
                    friendlist.save();
                    res.send({sucess:true, msg:'Friend Added!'});
                }
            });    
        }
    });
});

router.post('/friendList', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.user}, function(err,user){
        if(err){
            res.send({sucess:false, msg:'cannot find that user'});
        }else{
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    res.send({sucess:false, msg:'request from invalid user'});
                }else{
                    res.send({sucess:true, list:friendlist.friends});
                }
            });    
        }
    });
});

router.post('/removeFriend', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.target}, function(err,user){
        if(err){
            res.send({sucess:false, msg:'cannot find that user'});
        }else{
            Friendlist.findOne({username:req.body.user}, function(err2,friendlist){
                if(err2){
                    res.send({sucess:false, msg:'request from invalid user'});
                }else{
                    tempFriendlist = arrayRemove(friendlist.friends, user.username);
                    friendlist.friends = tempFriendlist;
                    friendlist.save();
                    res.send({sucess:true, msg:'Friend Remove!'});
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