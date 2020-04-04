// app config
var firebaseConfig = {
    apiKey: "AIzaSyBpgRviZS9t9WAXX8eVrk8vxfRCjWKQuxk",
    authDomain: "photoshare-a71b8.firebaseapp.com",
    databaseURL: "https://photoshare-a71b8.firebaseio.com",
    projectId: "photoshare-a71b8",
    storageBucket: "photoshare-a71b8.appspot.com",
    messagingSenderId: "659774003202",
    appId: "1:659774003202:web:7c656b44398f671855ef1b",
    measurementId: "G-KVZM9ZWKQE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// get reference to upload button element
const uploadButton = document.querySelector('#upload-button');

//get reference to progress bar element
const progressBar = document.querySelector('progress');

// global so can be accessed after it uploads
let imageFile

// event listener for upload button
uploadButton.addEventListener('change', (evt) => {

    // get the file chosen through event
    let file = evt.target.files[0];

    // variable for name of file
    let name = evt.target.files[0].name;

    // create storage reference to database using name of chosen file
    let storageRef = firebase.storage().ref(name);

    // attach put method to storageRef
    storageRef.put(file).on("state_changed", snapshot => {
        let percentage = Number(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)
        progressBar.value = percentage
    }, error => {
        console.log('error', error.message)
    }, () => {
        storageRef.put(file).snapshot.ref.getDownloadURL().then((url) => {
            // every time image uploaded, also add reference to database
            firebase.firestore().collection('images').add({
                url: url
            }).then(success => console.log(success)).catch(error => console.log(error))
            // console.log(url);

            setTimeout(() => {
                progressBar.removeAttribute('value')
            }, 1000)
        })
    })
});

// listen to database in the images collection. Loop through returned data to create image elements
firebase.firestore().collection('images').onSnapshot(snapshot => {
    document.querySelector('#images').innerHTML = ""
    snapshot.forEach(each => {
        console.log(each.data().url);
        let div = document.createElement('div')
        let image = document.createElement('img')
        image.setAttribute('src', each.data().url)
        div.append(image)
        document.querySelector('#images').append(div)
    })
});
