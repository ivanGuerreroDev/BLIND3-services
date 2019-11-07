var express = require('express');
var router = express.Router();
var token = require('../../middlewares/token');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Friendlist = mongoose.model('Friendlist');
var FriendRequest = mongoose.model('FriendRequest');



router.post('/findFriend', function(req, res, next){
    var username = req.body.username;
    var email = req.body.email;
    User.findOne({email:email}, function(err,user){
        if(err){ return res.send({success:false, msg:'No se encontro usuario'});
        }else if(user){
            Friendlist.findOne({username: username}, function(err,row){
                if(err){return res.send({success:true, user: user});}
                if(row != null){
                    if( !(row.friends.find(friend => friend.username === user.username)) ){
                        return res.send({success:true, user: user});
                    }else{
                        return res.send({success:false, msg: 'Usuario ya esta en tu lista de amigos'});
                    }
                }else{
                    return res.send({success:true, user: user});
                }
            })
        }else{
            return res.send({success:false,  msg: 'No se encontro usuario'});
        }
    });
    
});
router.post('/friendRequests', function(req, res, next){
    FriendRequest.find({request:req.body.username}, function(err,requests){
        if(err){ console.log(err); return res.send({success:false, msg:'No se encontro usuario'});
        }else if(requests){
            return res.send({success:true, requests: requests});
        }else{
            return res.send({success:false, msg:'No se encontro usuario'});
        }
    });
});
router.post('/addFriend', /*token,*/ function(req, res, next){
    FriendRequest.findOne({username:req.body.friend, request: req.body.username}, async function(err,rows){
        if(err){
            return res.send({success:false, msg:'Error 1'});
        }else{ 
            if(rows){
                var data1 = await User.findOne({username: req.body.username}).exec();
                var user1 = await Friendlist.findOne({username: req.body.friend}).exec();
                console.log(data1);
                user1.friends.push({username: data1.username, avatar: data1.avatar, nombresyapellidos: data1.nombresyapellidos});
                user1.save();
                var data2 = await User.findOne({username: req.body.friend}).exec();
                var user2 = await Friendlist.findOne({username: req.body.username}).exec()
                user2.friends.push({username: data2.username, avatar: data2.avatar, nombresyapellidos: data2.nombresyapellidos});
                user2.save();
                rows.remove();
                return  res.send({success:true, msg:'Amigo agregado!'});
            }else{
                return res.send({success:false, msg:'Error 2'});
            }
        }
    }); 
});
router.post('/denyFriend', /*token,*/ function(req, res, next){
    FriendRequest.findOne({username:req.body.friend, request: req.body.username}, function(err,rows){
        console.log(rows)
        if(err){
            return res.send({success:false, msg:'Error'});
        }else if(rows){
            
            rows.remove();
            return  res.send({success:true, msg:'Amigo rechazado!'});
        }else{
            return res.send({success:false, msg:'Error'});
        }
    }); 
});

router.post('/sendRequest', /*token,*/ function(req, res, next){
    FriendRequest.findOne({username:req.body.username, request: req.body.request}, function(err,rows){
        if(err){
            return res.send({success:false, msg:'Error'});
        }else if(rows){
            return res.send({success:true, msg:'Solicitud enviada'});
            
        }else{
            var newRequest = new FriendRequest();
            newRequest.username = req.body.username;
            newRequest.request = req.body.request;
            newRequest.save(function (err2) {
                if(err2){
                    return res.send({message:err2,success:false});
                }else{
                    return res.send({success:true, msg:'Solicitud enviada'});
                }
            })
            
        }
    }); 
});

router.post('/friendList', /*token,*/ function(req, res, next){

    User.findOne({username:req.body.username}, function(err,user){
        if(err){
            return res.send({success:false, msg:'No se encontro usuario'});
        }else if(user){
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    return res.send({success:false, msg:'Solicitud invalida'});
                }else if(friendlist){
                    return res.send({success:true, list:friendlist.friends});
                }else{
                    return res.send({success:true})
                }
            });    
        }else{res.send({success:false, msg:'No se encontro usuario'});}
    });
});

router.post('/removeFriend', /*token,*/ async function(req, res, next){

    User.findOne({username:req.body.friend}, function(err,user){
        if(err){
            return res.send({success:false, msg:'No se encontró usuario'});
        }else if(user){
            Friendlist.findOne({username:user.username}, function(err2,friendlist){
                if(err2){
                    return res.send({success:false, msg:'Error!'});
                }else if(friendlist){
                    var iDelete = findIndexByUsername(friendlist.friends, req.body.username);
                    delete friendlist.friends[iDelete];
                    console.log(friendlist)
                    friendlist.save();
                    Friendlist.findOne({username:req.body.username}, function(err3,friendlist2){
                        if(err3){
                            return res.send({success:false, msg:'Error!'});
                        }else if(friendlist2){
                            var iDelete = findIndexByUsername(friendlist2.friends, user.username);
                            delete friendlist2.friends[iDelete];
                            console.log(friendlist2)
                            friendlist2.save();
                            return res.send({success:true, msg:'Eliminado!'});
                        }
                    })
                }
            });
        }
    });
});

function findIndexByUsername(arr, value) {
    for(var key in arr)
    {
        if(arr[key].username===value)
            return key
    }
 
 }

module.exports = router;