var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var usernameRegex = /^[a-zA-Z0-9]+$/;
var passwordRegex = /^[0-9a-zA-Z]{8,}$/


function hello(){
    console.log("hola");
}

/*function request(req, res){

    var a = document.getElementById("but_submit");
    var email = a.children.email.value;
    var username = a.children.username.value;
    var password = a.children.password.value;
    var passwordC = a.children.passwordC.value;

}*/

$(document).ready(function(){

    $("#but_submit").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var email = $("#email").val();
        console.log(username,email,password);
        if( username !== "" && password !== "" && email !==""){
            $.ajax({
                url:'http://localhost:3000/accountCreation',
                type:'POST',
                dataType:'json',
                data:{username:username,password:password,email:email},
                success:function(response){
                    var msg = "";
                    if(response == 1){
                        window.location = "/";
                    }else{
                        msg = "Invalid username and password!";
                    }
                    $("#message").html(msg);
                }
            });
        }
    });

});

$(document).ready(function(){

    $("#but_delete").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var email = $("#email").val();
        console.log(username,email,password);
        if( username !== "" && password !== "" && email !==""){
            $.ajax({
                url:'http://localhost:3000/accountCreation',
                type:'POST',
                dataType:'json',
                data:{username:username,password:password,email:email},
                success:function(response){
                    var msg = "";
                    if(response == 1){
                        window.location = "/";
                    }else{
                        msg = "Invalid username and password!";
                    }
                    $("#message").html(msg);
                }
            });
        }
    });

});