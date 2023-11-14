var currentUser;

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #3:  insert using querySelector
            document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function

// Function to read the quote of the day from Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    console.log();
    db.collection("Main-Quote-Of-Day").doc(day)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
      .onSnapshot(doc => {                                                               //arrow notation                       //.data() returns data object
           document.getElementById("quote-of-day").innerHTML = doc.data().quote;      
      })
}

// Function to read the user name from the Firestore "Users" colleciton.
// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}

//-----------------------------------------------
// Create a "max" number of hike document objects
//-----------------------------------------------
function writeHikeLoop(max) {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("Hikes");
    for (i = 1; i <= max; i++) {
        hikesRef.add({ //add to database, autogen ID
            name: "hike" + i,
            details: "Elmo says this hike is amazing!  You will love going on hike" + i,
            lat: 49+i,    //randomly different
            lng: -122+i,  //randomly different
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        })
   }
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(hikeDocID) {
    // Manage the backend process to store the hikeDocID in the database, recording which hike was bookmarked by the user.
currentUser.update({
                    // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
            // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
    })
            // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
    .then(function () {
        console.log("bookmark has been saved for" + hikeDocID);
        var iconID = 'save-' + hikeDocID;
        //console.log(iconID);
                    //this is to change the icon of the hike that was saved to "filled"
        document.getElementById(iconID).innerText = 'bookmark';
    });
}

// -------------------------------------------------
// Read Hike information from the Firestore database
// -------------------------------------------------
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allHikes=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHikes.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var hikeLength = doc.data().length; //gets the length field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hikeCode}`; //Example: NV01.jpg
                
                // Hurrah!
                newcard.querySelector('.card-length').innerHTML =
                    "Duration: " + doc.data().length + "min <br>" +
                    "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();

                newcard.querySelector('a').href = "./eachHike.html?docID="+docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                // Add event listeners
                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                // Keep bookmark icon updates
                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                })

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("Users").doc(user.uid); //global
            console.log(currentUser);

            // figure out what day of the week it is today
            const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const d = new Date();
            let day = weekday[d.getDay()];

            // the following functions are always called when someone is logged in
            readQuote(day);
            insertNameFromFirestore();
            displayCardsDynamically("Hikes");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

doAll();
