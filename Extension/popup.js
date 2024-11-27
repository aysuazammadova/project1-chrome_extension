document.getElementById('add-field').addEventListener('click', addCustomField);
document.getElementById('add-mapping').addEventListener('click', addMapping);
document.getElementById('save-data').addEventListener('click', saveUserData);
document.getElementById('fill-form').addEventListener('click', fillForm);
document.getElementById('generate-cover-letter').addEventListener('click', generateCoverLetter);

function addCustomField() {
    const container = document.getElementById('fields-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'New Field';
    input.className = 'custom-field'; 
    container.appendChild(input);
}

function addMapping() {
    const mappingDiv = document.getElementById('mappings');
    const div = document.createElement('div');
    div.className = 'mapping';
    div.innerHTML = `
        <input class="stored-field" placeholder="Stored Field Name" type="text">
        <input class="form-field" placeholder="Form Field Identifier" type="text">
    `;
    mappingDiv.appendChild(div);
}

function saveUserData() {
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        portfolio: document.getElementById('portfolio').value,
        personal_summary: document.getElementById('personal_summaries').value,
        mappings: []
    };

    document.querySelectorAll('.custom-field').forEach((field, index) => {
        if (field.value) { 
            userData[`customField${index + 1}`] = field.value;
        }
    });

    document.querySelectorAll('.mapping').forEach(mapping => {
        const storedField = mapping.querySelector('.stored-field').value;
        const formField = mapping.querySelector('.form-field').value;
        if (storedField && formField) {
            userData.mappings.push({ storedField, formField });
        }
    });

    chrome.storage.local.set({ 'userData': userData }, () => {
        console.log('User data saved with mappings.');
    });
}

function fillForm() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content_script.js']
        });
    });
}

function generateCoverLetter() {
    const jobTitle = document.getElementById('job-title').value;
    const companyName = document.getElementById('company-name').value;
    const personalSummary = document.getElementById('personal_summaries').value;
    
    const apiURL = 'https://api.example.com/generateCoverLetter'; //API, URL must be changed
    const apiKey = 'your-api-token-here';

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ jobTitle, companyName, personalSummary })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cover letter generated:', data.coverLetter);
        displayCoverLetter(data.coverLetter);
    })
    .catch(error => {
        console.error('Error generating cover letter:', error);
    });
}

function displayCoverLetter(coverLetter) {
    const container = document.getElementById('cover-letter-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'cover-letter-container';
        newContainer.textContent = coverLetter;
        document.body.appendChild(newContainer);
    } else {
        container.textContent = coverLetter;
    }
}