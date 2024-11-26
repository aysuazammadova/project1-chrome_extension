document.getElementById('save-data').addEventListener('click', () => {
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        portfolio: document.getElementById('portfolio').value
    };
    chrome.storage.local.set({ 'userData': userData }, () => {
        console.log('User data saved.');
    }).catch(error => {
        console.error('Error saving data:', error);
    });
  });
  
  document.getElementById('fill-form').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: autofillForm
        });
    });
  });
  
  function autofillForm() {
    chrome.storage.local.get('userData', (data) => {
        if (data.userData) {
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                if (input.name === 'name') input.value = data.userData.name;
                if (input.name === 'email') input.value = data.userData.email;
                if (input.name === 'portfolio') input.value = data.userData.portfolio;
            });
        }
    });
  }


document.getElementById('add-field').addEventListener('click', addCustomField);
document.getElementById('save-data').addEventListener('click', saveUserData);

function addCustomField() {
    const container = document.getElementById('fields-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'New Field';
    input.className = 'custom-field'; 
    container.appendChild(input);
}

function saveUserData() {
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        portfolio: document.getElementById('portfolio').value,
        personal_summary: document.getElementById('personal_summaries').value
    };

    const customFields = document.querySelectorAll('.custom-field');
    customFields.forEach((field, index) => {
        if (field.value) { 
            userData[`customField${index + 1}`] = field.value;
        }
    });

    chrome.storage.local.set({ 'userData': userData }, () => {
        console.log('User data saved.');
    });
}