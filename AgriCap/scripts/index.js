let conditionList = document.querySelector('#condition-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
    if (user) {
        //account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
            <div>Logged in as ${user.email}</div>
            <div>${doc.data().company}</div>`;
            accountDetails.innerHTML = html;
        });

        // toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //hide account info
        accountDetails.innerHTML = '';
        // toggle user elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};

//setup table
const setupTable = (data) => {
    let columns = ['runId', 'initBiom', 'concCbd', 'wtCbd', 'effic','material', 'method', 'timestamp'];
    let headNames = ['Run ID', 'Initial Biomass (Kg)', 'Weight Concentration CBD (%)', 'Weight CBD (Kg)', 'Extraction Efficiency (%)', 'Material', 'Method', 'Date'];

    if (data.length) {
        conditionList.innerHTML = '';
        let tHead = document.createElement('thead');
        let headRow = document.createElement('tr');

        for (let i = 0; i < headNames.length; i++) {
            let cell = document.createElement('th');
            let cellText = document.createTextNode(headNames[i]);
            cell.appendChild(cellText);
            headRow.appendChild(cell);
        }

        tHead.appendChild(headRow);
        conditionList.appendChild(tHead);

        data.forEach(doc => {

            let row = document.createElement('tr');
            row.setAttribute('data-id', doc.id);

            for (let i = 0; i < columns.length; i++) {
                let cell = document.createElement('td');
                let cellText = eval('document.createTextNode(doc.data().' + columns[i] + ')');
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            // html += row;
            //     //cross for removing data
            let crossCell = document.createElement('td');
            let crossText = document.createTextNode('x');
            crossCell.appendChild(crossText);
            crossCell.style.cssText = 'background: rgba(255,255,255,0.6);' +
                'width: 40px;' +
                'text-align: center;' +
                'padding: 10px 0;' +
                'font-weight:  bold;' +
                'cursor:  pointer;';

            row.appendChild(crossCell);

            conditionList.appendChild(row);

            //delete data
            crossCell.addEventListener('click', (evt) => {
                evt.stopPropagation();
                let id = evt.target.parentElement.getAttribute('data-id');
                db.collection('run-metrics').doc(id).delete();
            });
            conditionList.appendChild(row);
        });

    } else {
        conditionList.innerHTML = '<h5 class="center-align white-text">Login to view data</h5>'
    }
};

// document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.dropdown-trigger');
//     var instances = M.Dropdown.init(elems, options);
//     console.log(instances);
// });


