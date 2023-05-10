const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const leftPanel = document.querySelector(".left-panel");
const rightPanel = document.querySelector(".right-panel");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

container.style.backgroundImage =
  "url('https://imagetolink.com/ib/FTj69HHARn.png')";
container.style.backgroundRepeat = "no-repeat";
container.style.backgroundSize = "cover";
container.style.position = "relative";
//////////////////////////////////////////////

let baseurl = "http://localhost:8080";
let signup_btn = document.querySelector("#button1");
let signin_btn = document.querySelector("#button2");

signup_btn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    // event.preventDefault();n

    let email = document.getElementById("email").value;
    let name = document.getElementById("name").value;
    let pass = document.getElementById("password").value;
    let obj = {
      name: name,
      email: email,
      password: pass,
    };
    let signup_res = await fetch(`${baseurl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    console.log(signup_res);
    if (signup_res.ok) {
      alert("Register Succecfully Now You Can Login");
    }
  } catch (error) {
    console.log(error);
    alert(`Something Went Wrong`);
  }
});

signin_btn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    // event.preventDefault();
    let email = document.getElementById("email-log").value;
    let password = document.getElementById("password-log").value;
    let obj = {
      email: email,
      password: password,
    };
    console.log(obj);

    let res = await fetch(`${baseurl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (res.ok) {
      let token = await res.json();
      localStorage.setItem("token", token.token);
      alert("Login Succecfully");
      window.location.href = "lobby.html";
    } else {
      alert("Wrong Credntials");
    }
  } catch (error) {
    alert("Something going wrong");
  }
});
