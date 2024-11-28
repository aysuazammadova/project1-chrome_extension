document.getElementById('add-field').addEventListener('click', addCustomField);
document.getElementById('add-mapping').addEventListener('click', addMapping);
document.getElementById('save-data').addEventListener('click', saveUserData);
document.getElementById('fill-form').addEventListener('click', () => {
    fillForm();
    logApplication();
});
document.getElementById('generate-cover-letter').addEventListener('click', generateCoverLetter);
document.getElementById('save-form').addEventListener('click', saveForm);
document.getElementById('load-form').addEventListener('click', function() {
    document.getElementById('import-data-input').click(); 
});
document.getElementById('import-data-input').addEventListener('change', importData);
document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('email-data').addEventListener('click', emailData);

document.addEventListener('DOMContentLoaded', function () {
    displayApplications();
    displaySavedForms();
});

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
    
    const apiURL = 'https://api.example.com/generateCoverLetter'; //must be changed
    const apiKey = 'your-api-token-here';//must be changed

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

function saveForm() {
    const formData = {
        name: document.getElementById('name').value,
        experience: document.getElementById('experience').value,
        education: document.getElementById('education').value,
        skills: document.getElementById('skills').value,
        email: document.getElementById('email').value,
        portfolio: document.getElementById('portfolio').value,
        personal_summaries: document.getElementById('personal_summaries').value,
        jobTitle: document.getElementById('job-title').value,
        companyName: document.getElementById('company-name').value
    };

    chrome.storage.local.get({ savedForms: [] }, function (result) {
        const savedForms = result.savedForms;
        savedForms.push(formData);
        chrome.storage.local.set({ savedForms: savedForms }, function () {
            console.log('Form data saved.');
            displaySavedForms();
        });
    });
}

function importData(event) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const data = JSON.parse(this.result);
        chrome.storage.local.set(data, function() {
            console.log('Data imported successfully.');
            displayApplications();
            displaySavedForms();
        });
    };
    fileReader.readAsText(event.target.files[0]);
}

function exportData() {
    chrome.storage.local.get(null, function(items) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "extension_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}

function emailData() {
    chrome.storage.local.get(null, function(items) {
        const dataStr = encodeURIComponent(JSON.stringify(items));
        const subject = encodeURIComponent("Backup of My Extension Data");
        const emailBody = "Here is a backup of my extension data:\n" + dataStr;
        window.open(`mailto:?subject=${subject}&body=${emailBody}`);
    });
}

function displaySavedForms() {
    chrome.storage.local.get('savedForms', function (result) {
        const savedForms = result.savedForms || [];
        const dropdown = document.getElementById('saved-forms-dropdown');
        dropdown.innerHTML = '';
        savedForms.forEach((form, index) => {
            const option = document.createElement('option');
            option.text = `Form ${index + 1}: ${form.companyName || 'Unknown'}`;
            dropdown.add(option);
        });
    });
}

