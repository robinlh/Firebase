// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB7O_qWSPZi_970g8RtIIVHLwHcfzm4u9U",
    authDomain: "chat-app-9c0f9.firebaseapp.com",
    databaseURL: "https://chat-app-9c0f9.firebaseio.com",
    projectId: "chat-app-9c0f9",
    storageBucket: "chat-app-9c0f9.appspot.com",
    messagingSenderId: "40063367330",
    appId: "1:40063367330:web:c7db3025acc285bc0bbffb",
    measurementId: "G-9S8BV9BGJV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

//Firestore
var db = firebase.firestore();

// Get the name for the user
if (!localStorage.getItem('name')) {
    name = prompt('What is your name?')
    localStorage.setItem('name', name)
} else {
    name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
    name = prompt('What is your name?')
    localStorage.setItem('name', name)
    document.querySelector('#name').innerText = name
});

// add new message to firestore collection
db.collection("messages").add({
    name: 'Robin Hall',
    message: 'Hello world'
}).then(function (docRef) {
    //success
}).catch(function (error) {
    //error
});

// event listener on message form
document.querySelector('#message-form').addEventListener('submit', evt => {
    evt.preventDefault();
    // get firestore messages collection reference
    // and add new entry
    db.collection("messages").add({
        name: name,
        message: document.querySelector('#message-input').value
        // success message promise
    }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.querySelector('#message-form').reset()
    }).catch(function (error) {
        console.log("Error adding doc: ", error);
    })
});

// real-time listener for chat stream
db.collection('messages').onSnapshot((snapshot) => {
    document.querySelector('#messages').innerHTML = ""
    snapshot.forEach((doc) => {
        var message  = document.createElement('div')
        message.innerHTML = `
        <p class="name">${doc.data().name}</p>
        <p>${doc.data().message}</p>`
        document.querySelector('#messages').prepend(message)
    });
});

// clear messages button even listener
document.querySelector('#clear').addEventListener('click', () => {
    // get snapshot of messages collection
    db.collection("messages").get().then( (snapshot) => {
        // for each item in returned collection
        snapshot.forEach( (doc) => {
            // delete the item with corresponding id
            // note: doc() function gets document from Firestore, doc is Firestore object
            db.collection("messages").doc(doc.id).delete()
                .then( () => {
                console.log("Document deleted successfully");
                }).catch( (error) => {
                    console.error("Error removing document: ", error)
            })
        })
    }).catch((error) => {
        console.log("Error retrieving documents: ", error);
    });
});