document.getElementById("signup-toggle").addEventListener("click", function(){
    document.getElementById("login-form").classList.remove("active");
    document.getElementById("signup-form").classList.add("active");
});

document.getElementById("login-toggle").addEventListener("click", function(){
    document.getElementById("signup-form").classList.remove("active");
    document.getElementById("login-form").classList.add("active");
});

// import Swal from 'sweetalert2'

// CommonJS
// const Swal = require('sweetalert2')

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const usernameInput = document.getElementById("loginemail");
    // const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.getElementById("loginPassword");
const username = usernameInput.value;
    // const email = emailInput.value;
    const password = passwordInput.value;
    const data = {email: username, password: password};
    console.log(data)
    if( password && username!=""){
        fetch("https://wild-gold-betta-fez.cyclic.app/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(res=>res.json())
            .then(res=>{
                console.log(res)
                if(res.err){
                    // alert(res.err)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'please check details',
                        footer: '<a href="">Why do I have this issue?</a>'
                      })
                }else{
                    // alert(res.success)
                    Swal.fire(
                        'Good job!',
                        'Successfully LoggedIn',
                        'success'
                      )
                      setTimeout(()=>{
                        window.location.href="lobby.html"
                      },2500)

                   
                }
            })
        .catch(error => {
            console.error(error);
            alert("Invalid Credentials")
        });
    }else{
        // alert("please fill all details")
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'please fill all details',
            footer: '<a href="">Why do I have this issue?</a>'
          })
    }
 
});

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("Password");
const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const data = {name: username, email: email, password: password};
    console.log(data)
    if(email && password && username!=""){
        fetch("https://wild-gold-betta-fez.cyclic.app/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res=>res.json())
            .then(res=>{
                console.log(res)
                if(res.msg){
                    // alert(res.msg)
                    Swal.fire(
                        'Good job!',
                        'Successfully Registered',
                        'success'
                      )
                      setTimeout(()=>{
                          window.location.href="login.html"
                      },1500)
                }else{
                    // alert(res.message)
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'User Already Exists',
                        footer: '<a href="">Why do I have this issue?</a>'
                      })
                }
                
            })
    .catch(error => {
       
        console.error(error);
    });
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'please fill all details',
            footer: '<a href="">Why do I have this issue?</a>'
          })
        // alert("please fill all details")
    }
    
});
