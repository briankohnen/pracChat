const firebaseConfig = {
    apiKey: "AIzaSyDs8CnBxteandAnYCL8-iW2vKccMQWwTuQ",
    authDomain: "pracchat-b3755.firebaseapp.com",
    databaseURL: "https://pracchat-b3755.firebaseio.com",
    projectId: "pracchat-b3755",
    storageBucket: "",
    messagingSenderId: "162532882764",
    appId: "1:162532882764:web:2c1a2422ee109a7d"
  };

firebase.initializeApp(firebaseConfig);
let database = firebase.database();

var userSignup = document.getElementById("signup");
var userLogin = document.getElementById("login");
var signinmodal = document.getElementById("signInModal");
var submitChat = document.getElementById("submitChat");
var chatArea = document.getElementById("chatArea");

userSignup.onclick = function() {
    var modalHead = document.getElementById("modalHead")
    modalHead.textContent = "Sign up now and get started";
    var logorsign = document.getElementById("logorsign");
    logorsign.textContent = "";
    var inps = document.createElement("FORM");
    var signupEmail = document.createElement("INPUT")
    signupEmail.setAttribute("id", "email")
    var signupPass = document.createElement("INPUT")
    signupPass.setAttribute("id", "password")
    var subSignup = document.createElement("BUTTON");
    subSignup.innerHTML = "Sign up";

    inps.appendChild(signupEmail);
    inps.appendChild(signupPass);
    inps.appendChild(subSignup);

    var modalLogOrSign = document.getElementById("modalLogOrSign");
    modalLogOrSign.appendChild(inps);


    subSignup.onclick = function() {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
        alert('Please enter an email address.');
        return;
        }
        if (password.length < 4) {
        alert('Please enter a password.');
        return;
        }
            // Sign in with email and pass.
            // [START createwithemail]
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
        signinmodal.style.display = "none";

    }
};


userLogin.onclick = function() {

        var modalHead = document.getElementById("modalHead")
        var logorsign = document.getElementById("logorsign");
        var inps = document.createElement("FORM");
        var loginEmail = document.createElement("INPUT")
        var loginPass = document.createElement("INPUT")
        var subLogin = document.createElement("BUTTON");
        
        modalHead.textContent = "";


    modalHead.textContent = "Log in with existing credentials";

    logorsign.textContent = "";

    loginEmail.setAttribute("id", "email")

    loginPass.setAttribute("id", "password")

    subLogin.innerHTML = "Log in";
    inps.appendChild(loginEmail);
    inps.appendChild(loginPass);
    inps.appendChild(subLogin);

    var modalLogOrSign = document.getElementById("modalLogOrSign");
    modalLogOrSign.appendChild(inps);

    subLogin.onclick = function () {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            if (error) {
                if (error.code == "auth/user-not-found") {
                    modalHead.textContent = "User not found, try again";
     
                } else if (error.code == "auth/wrong-password") {
                    modalHead.textContent = "Wrong password, try again";

                } else {
                    modalHead.textContent = "Unexpected error, please try again";
                }
            }
          });
          signinmodal.style.display = "none";
    }


};


submitChat.onclick = function() {

    event.preventDefault();

    var chatInp = document.getElementById("userChatInp");

    if (chatInp.value.trim() !== "") {

        var banter = chatInp.value.trim();

        // var username = sessionStorage.getItem("username");

        var newBanter = {
            //user: username,
            text: banter,
            time: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref("messaging").push(newBanter);
    }

    chatInp.value = "";
};


database.ref("messaging").on("child_added", function(snapshot) {
    
    var snap = snapshot.val();
    //var textUser = snap.user;
    var textVal = snap.text;
    var textTime = moment(snap.time).format("LT");

    var newMessageDiv = document.createElement("DIV");
    var newUserIMG = document.createElement("IMG");
    var newUserChatName = document.createElement("h4");
    var newUserChatTime = document.createElement("P");
    var newUserChatMessage = document.createElement("P");

    newMessageDiv.setAttribute("class", "userChat");
    newUserIMG.setAttribute("class", "userImg");
    newUserIMG.setAttribute("src", "https://via.placeholder.com/75");
    newUserChatName.setAttribute("class", "userChatName");
    newUserChatTime.setAttribute("class", "userChatTime");
    newUserChatMessage.setAttribute("class", "userChatMessage");

    newUserChatName.textContent = "BRIANtEST";
    newUserChatTime.textContent = textTime;
    newUserChatMessage.textContent = textVal;

    newMessageDiv.append(newUserIMG);
    newMessageDiv.append(newUserChatName);
    newMessageDiv.append(newUserChatTime);
    newMessageDiv.append(newUserChatMessage);


    //newMessage.textContent = "USER" + " @ " + textTime + " : " + textVal;

    chatArea.prepend(newMessageDiv);
    
});