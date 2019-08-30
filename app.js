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

var userName = "";
var userSignup = document.getElementById("signup");
var userLogin = document.getElementById("login");
var signinmodal = document.getElementById("signInModal");
var submitChat = document.getElementById("submitChat");
var chatArea = document.getElementById("chatArea");
var addChannel = document.getElementById("addChannel");
var addchannelmodal = document.getElementById("addchannelModal");


var activeChat = "general";
loadChat(activeChat);


userSignup.onclick = function() {
    var breaker = document.createElement("BR");
    var breaker2 = document.createElement("BR");
    var modalHead = document.getElementById("modalHead")
    modalHead.textContent = "Sign up now and get started";
    var logorsign = document.getElementById("logorsign");
    logorsign.textContent = "";
    var inps = document.createElement("FORM");
    var signupEmail = document.createElement("INPUT")
    signupEmail.setAttribute("id", "email")
    signupEmail.setAttribute("placeholder", "E-mail in valid format");
    var signupPass = document.createElement("INPUT")
    signupPass.setAttribute("id", "password")
    signupPass.setAttribute("placeholder", "Password, longer than 4 characters")
    signupPass.setAttribute("type", "password");
    var subSignup = document.createElement("BUTTON");
    subSignup.innerHTML = "Sign up";

    inps.appendChild(signupEmail);
    inps.append(breaker);
    inps.appendChild(signupPass);
    inps.appendChild(breaker2);
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

    var breaker = document.createElement("BR");
    var breaker2 = document.createElement("BR");
        var modalHead = document.getElementById("modalHead")
        var logorsign = document.getElementById("logorsign");
        var inps = document.createElement("FORM");
        var loginEmail = document.createElement("INPUT")
        loginEmail.setAttribute("placeholder", "E-mail")
        var loginPass = document.createElement("INPUT")
        loginPass.setAttribute("placeholder", "Password")
        loginPass.setAttribute("type", "password");
        var subLogin = document.createElement("BUTTON");
        
        modalHead.textContent = "";


    modalHead.textContent = "Log in with existing credentials";

    logorsign.textContent = "";

    loginEmail.setAttribute("id", "email")

    loginPass.setAttribute("id", "password")

    subLogin.innerHTML = "Log in";
    inps.appendChild(loginEmail);
    inps.append(breaker);
    inps.appendChild(loginPass);
    inps.append(breaker2);
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

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              userName = user.email;
              //var photoURL = user.photoURL;
              addBanter(userName, activeChat);
              } 
        });

    function addBanter(placeUser, active) {
        var banter = chatInp.value.trim();
        var newBanter = {
            user: placeUser,
            text: banter,
            time: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref(active).push(newBanter);
        chatInp.value = "";
        }
    }
};




addChannel.onclick = function() {
    addchannelmodal.style.display = "block";
    var channelsub = document.getElementById("channelsub");
    channelsub.onclick = function() {
        event.preventDefault();
        var channy = document.getElementById("channeljoin").value;
        
        database.ref().once('value', function(snapshot) {
            if(snapshot.hasChild(channy)) {
                activeChat = channy;
                addchannelmodal.style.display = "none";
                
                loadChat(activeChat);
            } else {

                var openChatbant = {
                    user: userName,
                    text: "Created Channel : " + channy,
                    time: firebase.database.ServerValue.TIMESTAMP
                }

                database.ref(channy).push(openChatbant);
                addchannelmodal.style.display = "none";
                var channelList = document.getElementById("channelList");
                var newChannel = document.createElement("LI");
                newChannel.setAttribute("class", "userChannels, litty");
                newChannel.setAttribute("data", channy);
                newChannel.textContent = channy;
                channelList.append(newChannel);
                activeChat = channy;
                
                loadChat(activeChat);
            }
        })
    }
}

function loadChat(activeRoom) {
    
    var chatareaclear = document.getElementById("chatArea");
        chatareaclear.innerHTML = "";

    database.ref(activeRoom).on("child_added", function(snapshot) {
    
        var snap = snapshot.val();
        var textUser = snap.user;
        var textVal = snap.text;
        var textTime = moment(snap.time).format("lll");

    
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
    
        newUserChatName.textContent = textUser;
        newUserChatTime.textContent = textTime;
        newUserChatMessage.textContent = textVal;
    
        newMessageDiv.append(newUserIMG);
        newMessageDiv.append(newUserChatName);
        newMessageDiv.append(newUserChatTime);
        newMessageDiv.append(newUserChatMessage);
    
        chatArea.prepend(newMessageDiv);
        
    });
};


document.onclick = function () {

    var issaChannel = document.getElementsByClassName("userChannels, litty");

    for (var i = 0; i < issaChannel.length; i++) {

        issaChannel[i].onclick = function() {

            activeChat = this.getAttribute("data");
            
        }; loadChat(activeChat);
    } 
}












// database.ref("general").on("child_added", function(snapshot) {
    
//     var snap = snapshot.val();
//     var textUser = snap.user;
//     var textVal = snap.text;
//     var textTime = moment(snap.time).format("lll");

//     var newMessageDiv = document.createElement("DIV");
//     var newUserIMG = document.createElement("IMG");
//     var newUserChatName = document.createElement("h4");
//     var newUserChatTime = document.createElement("P");
//     var newUserChatMessage = document.createElement("P");

//     newMessageDiv.setAttribute("class", "userChat");
//     newUserIMG.setAttribute("class", "userImg");
//     newUserIMG.setAttribute("src", "https://via.placeholder.com/75");
//     newUserChatName.setAttribute("class", "userChatName");
//     newUserChatTime.setAttribute("class", "userChatTime");
//     newUserChatMessage.setAttribute("class", "userChatMessage");

//     newUserChatName.textContent = textUser;
//     newUserChatTime.textContent = textTime;
//     newUserChatMessage.textContent = textVal;

//     newMessageDiv.append(newUserIMG);
//     newMessageDiv.append(newUserChatName);
//     newMessageDiv.append(newUserChatTime);
//     newMessageDiv.append(newUserChatMessage);

//     chatArea.prepend(newMessageDiv);
    
// });
