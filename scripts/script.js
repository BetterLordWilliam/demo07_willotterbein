//---------------------------------
// Your own functions here
//---------------------------------
function sayHello() {
    //do something
}

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
      }).catch((error) => {
        // An error happened.
      });
}


//sayHello();    //invoke function