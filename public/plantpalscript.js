// Plant Explorer code

const plantForm = document.getElementById("plantForm");
const plantInput = document.getElementById("plantInput");
const apiKey = "sk-r2vI65f741c9f0cee4764";


//code for searching for specific plants on the Explor page
async function getPlants(){

    try{
        document.getElementById('plantForm').innerHTML="";

        const response = await fetch(`https://perenual.com/api/species-list?key=${apiKey}&q=`+plantInput.value);

        if(!response.ok){
            throw new Error('Unable to retrieve information');
        }

        const data = await response.json(); 

        const name = data.data[0].common_name;
        const scientificName = data.data[0].scientific_name;
        const type = data.data[0].watering;
        const sunlight = data.data[0].sunlight;

        const plantPicture = data.data[0].default_image.small_url;
        const imgElement = document.getElementById("plantPic");

        imgElement.src = plantPicture;
        imgElement.style.display = "block";

        const details = "Common Name: "+name+"<br>"+
                        "Scientific Name: "+scientificName+"<br>"+
                        "Watering frequency? "+type+"<br>"+
                        "What kind of sunlight? "+sunlight;

        document.getElementById('plantDetails').innerHTML = details;

        const addButton = document.getElementById("addPlantBtn");
        addButton.style.display = "block";
        
}
    catch(error) {
        console.log('error', error);
    }
}//end getPlants()

//code for adding plants to list and sending them to server to be saved in MySQL
async function addPlants(){

    try{    
        document.getElementById('plantForm').innerHTML="";
    
        const response = await fetch(`https://perenual.com/api/species-list?key=${apiKey}&q=`+plantInput.value)
    
    
        if(!response.ok){
            throw new Error('Unable to retrieve information');
        }
    
        const data = await response.json();  
        
        const name = data.data[0].common_name;
        const type = data.data[0].watering;

        const dateAdded = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const serverInfo = { name, type, dateAdded };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverInfo)
            };
    
        const res = await fetch('/api', options);
        const res_data = await res.json();
        console.log(res_data);

    }
    catch(error) {
        console.log('error', error);
    }
}//end addPlants()


//code below to capture current date and time; also formats to add to MySQL
function updateDate(){

    const plantName = document.getElementById('wateredPlants').value;
    const newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantName, newDate })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error: ', error);
    }) 
}//end updateDate()

//code to retrieve data from MySQL and display in table format
function myPlants() {
    fetch('/plants')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById(plantsTable);
            data.forEach(item => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = item.name;
                row.appendChild(nameCell);

                const typeCell = document.createElement('td');
                typeCell.textContent = item.type;
                row.appendChild(typeCell);

                const dateCell = document.createElement('td');
                dateCell.textContent = item.recentDate;
                row.appendChild(dateCell);

                const nextDateCell = document.createElement('td');
                nextDateCell.textContent = item.nextDate;
                row.appendChild(nextDateCell);

                plantsTableBody.appendChild(row);

            });
        })
        .catch(error => console.error('Error fetching data: ', error));
}//end myPlants()

myPlants();
