const firebaseConfig = {
    apiKey: "AIzaSyA0nj9ls7_YPyia3pWWxR6ECzTtKPehLws",
    authDomain: "generalapps-44ab4.firebaseapp.com",
    databaseURL: "https://generalapps-44ab4.firebaseio.com",
    projectId: "generalapps-44ab4",
    storageBucket: "generalapps-44ab4.appspot.com",
    messagingSenderId: "493528709114",
    appId: "1:493528709114:web:2bb72111188338508a1643",
    measurementId: "G-G69NEVDJ21"
};

firebase.initializeApp(firebaseConfig);

// VARIABLES
// Access the modal element
// Reference to auth method of Firebase
const auth = firebase.auth();

// Reference to storage method of Firebase
const storage = firebase.storage();

// Reference to database method of Firebase
const database = firebase.firestore();

// Get the modal
const modal = document.getElementById('modal');

// Get the element that closes the modal
const close = document.getElementById('#close');

// Get forms for email and password authentication
const createUserForm = document.getElementById('create-user-form');
const signInForm = document.getElementById('sign-in-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Get authentication dialogs
const createUserDialog = document.getElementById('create-user-dialog');
const signInDialog = document.getElementById('sign-in-dialog');
const haveOrNeedAccountDialog = document.getElementById('have-or-need-account-dialog');

// Access elements that need to be hidden or show based on auth state
const hideWhenSignedIn = document.querySelectorAll('.hide-when-signed-in')
const hideWhenSignedOut = document.querySelectorAll('.hide-when-signed-out')

// When the user clicks the (x) button close the modal
close.addEventListener('click', () => {
    modal.style.display = 'none';
});

// When the user click anywhere outside of the modal close it.
window.addEventListener('click', event => {
    if (event.target == modal){
        modal.style.display = 'none';
    };
});

let uid

// Makes your app aware of users
auth.onAuthStateChanged(user => {
    if (user) {

        // Everything inside here happens if user is signed in
        console.log(user)
        uid = user.uid
        modal.style.display = 'none'

        // Hides or shows elements depending on if user is signed in
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.add('hide')
        });
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.remove('hide')
        });

        // Greet the user with a message and make it personal by using their name
        if (user.displayName) {
            document.getElementById('display-name-header').textContent = `Hello, ${user.displayName}`
        }

    } else {
        // Everything inside here happens if user is not signed in
        console.log('not signed in');

        // Hides or shows elements depending on if user is signed out
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.remove('hide')
        });
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.add('hide')
        });

    };
});

// access auth elements to listen for auth actions
const authAction = document.querySelectorAll(`.auth`);

// Loop through elements and use the auth attribute to determine what action to take when clicked
authAction.forEach(eachItem => {
    eachItem.addEventListener(`click`, event => {
        let chosen = event.target.getAttribute(`auth`);
        if (chosen === 'show-create-user-form'){
            showCreateUserForm();
        }
        else if (chosen === 'show-sign-in-form'){
            showSignInForm();
        }
        else if (chosen === 'show-forgot-password-form'){
            showForgotPasswordForm();
        }
        else if (chosen === `sign-out`){
            signOut();
        }
    });
});

// Invoked when when we want to hide all auth elements
hideAuthElements = () => {
    createUserForm.classList.add(`hide`)
    signInForm.classList.add(`hide`)
    forgotPasswordForm.classList.add(`hide`)
    createUserDialog.classList.add(`hide`)
    signInDialog.classList.add(`hide`)
    haveOrNeedAccountDialog.classList.add(`hide`)
}

// Invoked when user wants to create a new account
showCreateUserForm = () => {
    hideAuthElements();
    modal.style.display = `block`;
    createUserForm.classList.remove(`hide`);
    signInDialog.classList.remove(`hide`);
    haveOrNeedAccountDialog.classList.remove(`hide`);
};

// Invoked when a user wants to sign in
showSignInForm = () => {
    hideAuthElements();
    modal.style.display = `block`;
    signInForm.classList.remove(`hide`);
    createUserDialog.classList.remove(`hide`);
    haveOrNeedAccountDialog.classList.remove(`hide`);
};

// Invoked when a user wants reset their password
showForgotPasswordForm = () => {
    hideAuthElements()
    modal.style.display = `block`
    forgotPasswordForm.classList.remove(`hide`)
};

// Invoked when user wants to sign out
signOut = () => {
    auth.signOut();
    hideAuthElements();
};


// Create user form submit event
createUserForm.addEventListener(`submit`, event => {
    event.preventDefault();
    // Grab values from form
    const displayName = document.getElementById(`create-user-display-name`).value;
    const email = document.getElementById(`create-user-email`).value;
    const password = document.getElementById(`create-user-password`).value;
    // Send values to Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            firebase.auth().currentUser.updateProfile({
                displayName: displayName
            })
            createUserForm.reset()
            hideAuthElements()
        })
        .catch(error => {
            console.log(error.message)
        });
});