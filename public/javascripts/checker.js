var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var usernameRegex = /^[a-zA-Z0-9]+$/;
var passwordRegex = /^[0-9a-zA-Z]{8,}$/

/*function request(req, res){

    var a = document.getElementById("but_submit");
    var email = a.children.email.value;
    var username = a.children.username.value;
    var password = a.children.password.value;
    var passwordC = a.children.passwordC.value;

}*/


//Create User
$(document).ready(function(){

    $("#but_submit_registro").click(function(){
        var username = $("#txt_user_registro.textbox").val();
        var password = $("#txt_pass_registro.textbox").val();
        var email = $("#txt_email_registro.textbox").val();
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

//DeleteUser
$(document).ready(function(){

    $("#but_delete").click(function(){
        
        var username = $("#but_delete_username").val();
        var password = $("#but_delete_password").val();
        var email = $("#but_delete_email").val();

        if( username !== "" && password !== "" && email !==""){
            $.ajax({
                url:'http://localhost:3000/accountDelete',
                type:'POST',
                dataType:'json',
                data:{username:username,password:password,email:email},
                success:function(response){
                    var msg = "";
                    if(response == 1){
                        window.location = "/accountDelete";
                    }else{
                        msg = "Invalid username and password!";
                    }
                    $("#message").html(msg);
                }
            })
        }
    })

});

//login
$(document).ready(function(){

    $("#but_submit_login").click(function(){
        
        console.log("hola");

        var username = $("#txt_uname_login.textbox").val();
        var password = $("#txt_pwd_login.textbox").val();

        if( username !== "" && password !== "" ){
            $.ajax({
                url:'http://localhost:3000/login',
                type:'POST',
                dataType:'json',
                data:{username:username,password:password},
                success:function(response){
                    var msg = "";
                    if(response == 1){
                        window.location = "/login";
                    }else{
                        msg = "Invalid username and password!";
                    }
                    $("#message").html(msg);
                }
            })
        }
    })

});