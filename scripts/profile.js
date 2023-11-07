var currentUser;

// ------------------------------
// Populate Existing Information.
// ------------------------------
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("Users").doc(user.uid)

            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {
            console.log ("No user is signed in");
        }
    });
}

populateUserInfo();

// ---------------------------------------------
// Handles the users request to edit the fields.
// ---------------------------------------------
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

// --------------------------------------------
// Handles the users request to save the field.
// --------------------------------------------
function saveUserInfo() {
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"

    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    document.getElementById('personalInfoFields').disabled = true;
}
