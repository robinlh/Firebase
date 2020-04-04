//listen for auth status changes
auth.onAuthStateChanged(user => {

    if (user) {
        console.log('user logged in');
        // using real-time listener
        db.collection('run-metrics').orderBy('timestamp').onSnapshot(snapshot => {
            // let changes = snapshot.docChanges();
            // changes.forEach(change => {
            //     if(change.type === 'added'){
            //         setupTable(snapshot.docs);
            //     } else if (change.type === 'removed'){
            //         let td = conditionList.querySelector('[data-id=' + change.doc.id + ']');
            //         conditionList.removeChild(td);
            //     }
            // });
            setupTable(snapshot.docs);
            setupUI(user);
        }, err => {
            console.log(err.message);
        });

        //use .where() for queries
        //use .orderBy() for ordering data

    } else {
        console.log('user logged out');
        setupUI();
        setupTable([]);
    }
});

//EXTRA FUNCTIONS
// function to format months/hours/minutes for timestamp
function format(entry) {
    if (entry < 10){
        return '0' + entry;
    }
    return entry;
}

//create formatted timestamp
function createTimestamp() {
    // current date and time
    let currentDate = new Date();
    return currentDate.getDate() + "/"
        + format((currentDate.getMonth() + 1)) + "/"
        + currentDate.getFullYear() + "@"
        + format(currentDate.getHours()) + ":"
        + format(currentDate.getMinutes());
}

// create new entry
const form = document.querySelector('#add_entry_form');
//saving data
form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    db.collection('run-metrics').add({
        // NB using dots works because names have underscores (use square bracket notation for names with hyphens)
        runId: form.runId.value,
        initBiom: form.initBiom.value,
        concCbd: form.concCbd.value,
        wtCbd: form.wtCbd.value,
        effic: form.effic.value,
        material: form.material.value,
        method: form.method.value,
        timestamp: createTimestamp(),
        userId: auth.currentUser.uid
    }).then(() => {
        const modal = document.querySelector('#entry_modal');
        M.Modal.getInstance(modal).close();
        form.reset();
    }).catch(err => {
        console.log(err.message);
    });
});

//ordering data from dropdown menu
// const dropdownMenu = document.querySelector()

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password)
    //     .then(cred => {
    //     console.log('Point of failure 2');
    //     return db.collection('users').doc(cred.user.uid).set({
    //         company: signupForm['signup-company'].value
    //     });
    // })
        .then(() => {
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //console.log(cred.user);
        //close login modal and reset
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (evt) => {
    evt.preventDefault();
    // auth.signOut().then(() => {
    //     console.log('user signed out');
    // })
    auth.signOut();
});

//acount info
const accountInfo = document.querySelector('#modal-account');
const accountBtn = document.querySelector('#account-btn');

accountBtn.addEventListener('click', evt => {
    var user = auth.currentUser;
    evt.preventDefault();
    const html = `
    <div>Logged in as ${user.email}</div>`;
    accountInfo.innerHTML = html;
});
