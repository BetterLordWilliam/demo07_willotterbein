function getNameFromAuth() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if a user is signed in:
      if (user) {
          // Do something for the currently logged-in user here: 
          console.log(user.uid); //print the uid in the browser console
          console.log(user.displayName);  //print the user name in the browser console
          userName = user.displayName;

          //method #1:  insert with JS
          //document.getElementById("name-goes-here").innerText = userName;    

          //method #2:  insert using jquery
          //$("#name-goes-here").text(userName); //using jquery

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
    db.collection("Main-Quote-Of-Day").doc(day)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
      .onSnapshot(dayDoc => {                                                               //arrow notation
           console.log("current document data: " + dayDoc.data());                          //.data() returns data object
           document.getElementById("quote-of-day").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place
           
           //Here are other ways to access key-value data fields
           //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
           //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
		       //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;
      })
}
readQuote("tuesday");        //calling the function

// Function to read the user name from the Firestore "Users" colleciton.
function insertNameFromFirestore() {
    firebase.auth().onAuthStateChanged(user =>{
        if (user) {
            console.log(user.uid);
            currentUser = db.collection("Users").doc(user.uid);
            currentUser.get().then(userDoc => {
                var userName = userDoc.data().name;
                console.log(userName);
                document.getElementById("user-name").innerText = userName;
            })
        } else {
            console.log("No user is logged in.");
        }
    })
}
insertNameFromFirestore();

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
                newcard.querySelector('.card-length').innerHTML = hikeLength +"km";
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hikeCode}`; //Example: NV01.jpg
                newcard.querySelector('a').href = "./eachHike.html?docID="+docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("Hikes");  //input param is the name of the collection


