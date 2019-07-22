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
        var key = 'secret';
        console.log(username,email,password);

        if( username !== "" && password !== "" && email !==""){
            $.ajax({
                url:'http://localhost:3000/accountCreation',
                type:'POST',
                dataType:'json',
                data:{username:username,password:password,email:email,key:key},
                success:function(response){
                    var msg = "";
                    console.log(response);
                    if(response.valid == 1){
                        console.log("valido")
                    }else{
                        msg = "Invalid username and password!";
                    }
                    $("#message").html(msg);
                }
            });
        }
    });

});

//Request Code
$(document).ready(function(){

    $("#but_submit_solicitarCodigo").click(function(){
        var email = $("#txt_correo_registro.textbox").val();
        var key = 'secret';
        console.log(email);

        if(email !==""){
            $.ajax({
                url:'http://localhost:3000/permission',
                type:'POST',
                dataType:'json',
                data:{email:email,key:key},
                success:function(response){
                    var msg = "";
                    console.log(response);
                    if(response.valid == 1){
                        //window.location = "/accountCreation";
                    }else{
                        msg = "Invalid email!";
                    }
                    $("#message").html(msg);
                }
            });
        }
    });

});

//Send Code
$(document).ready(function(){

    $("#but_submit_enviarCodigo").click(function(){
        var code = $("#txt_codigo_registro.textbox").val();
        var email = $("#txt_correo_registro.textbox").val();
        var key = 'secret';

        if(code !==""){
            $.ajax({
                url:'http://localhost:3000/allowing',
                type:'POST',
                dataType:'json',
                data:{email:email,code:code,key:key},
                success:function(response){
                    var msg = "";
                    console.log(response);
                    if(response.valid == 1){
                        //window.location = "/accountCreation";
                    }else{
                        msg = "Invalid Code!";
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

//Password Recovery
$(document).ready(function(){

    $("#but_submit_solicitarCodigo2").click(function(){
        
        var email = $("#txt_correo_recuperar.textbox").val();
        var key = 'secret';
        console.log(email);

        if(email !==""){
            $.ajax({
                url:'http://localhost:3000/recovery',
                type:'POST',
                dataType:'json',
                data:{key: key,email:email},
                success:function(response){
                    var msg = "";
                    console.log(response);
                    if(response == 1){
                        window.location = "/";
                    }else{
                        
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