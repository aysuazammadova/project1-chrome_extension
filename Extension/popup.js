/*
document.addEventListener("DOMContentLoaded", () => {
    loadProfiles();

    document.getElementById("profileSelector").addEventListener("change", () =>{
        const selectedProfileIndex = document.getElementById("profileSelector").value;
        chrome.storage.local.set({ activeProfile: parseInt(selectedProfileIndex)}, loadProfileData);
    })

    document.getElementById("newProfile").addEventListener("click", () => {
        showProfileForm("New Profile", {});
    })

    document.getElementById("editProfile").addEventListener("click", () =>{
        const selectedProfileIndex = document.getElementById("profileSelector").value;
        chrome.storage.local.get("profiles", (data) =>{
            const profile = data.profiles[selectedProfileIndex];
            showProfileForm("Edit Profile", profile, selectedProfileIndex);
        })
    })

    document.getElementById("saveProfile").addEventListener("click", () =>{
        const profileName = document.getElementById("profileName").value.trim();
        const profileData = {
            name: document.getElementById("name").value,
            experience: document.getElementById("experience").value,
            education: document.getElementById("education").value,
            skills: document.getElementById("skills").value,
            email: document.getElementById("email").value,
            portfolio: document.getElementById("portfolio").value,
            personal_summary: document.getElementById("personal_summaries").value,
        };

        const customFields = document.querySelectorAll(".custom-field");
        customFields.forEach((field, index) => {
            if (field.value) {
                profileData[`customField${index + 1}`] = field.value;
            }
        });

        chrome.storage.local.get("profiles", (data) =>{
            const profiles = data.profiles || [];
            const profileIndex = parseInt(document.getElementById("profileSelector").value);

            if (!isNaN(profileIndex) && profiles[profileIndex]) {
                profiles[profileIndex] = { name: profileName, data: profileData };
            } else {
                profiles.push({ name: profileName, data: profileData });
            }

            chrome.storage.local.set({ profiles }, () =>{
                loadProfiles();
                document.getElementById("profileForm").style.display = "none";
            });
            
        });
    });

    document.getElementById("cancelProfile").addEventListener("click", () =>{
        document.getElementById("profileForm").style.display = "none";
    });


    document.getElementById("add-field").addEventListener("click", () => {
        const container = document.getElementById("fields-container");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "New Field";
        input.className = "custom-field";
        container.appendChild(input);
    });
});


function loadProfiles(){
    chrome.storage.local.get("profiles", (data) => {
        const profiles = data.profiles || [];
        const profileSelector = document.getElementById("profileSelector");

        profileSelector.innerHTML = "";

        profiles.forEach((profile, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = profile.name || `Profile ${index + 1}`;
            profileSelector.appendChild(option);
        });

        chrome.storage.local.get("activeProfile", (data) => {
            const activeProfileIndex = data.activeProfile ?? 0;
            profileSelector.value = activeProfileIndex;
            loadProfileData();
        });
    });
}


function loadProfileData(){
    chrome.storage.local.get(["profiles", "activeProfile"], (data) => {
        const profiles = data.profiles || [];
        const activeProfileIndex = data.activeProfile ?? 0;
        const activeProfile = profiles[activeProfileIndex];

        if (activeProfile){
            const profile = activeProfile.data;

            document.getElementById("name").value = profile.name || "";
            document.getElementById("experience").value = profile.experience || "";
            document.getElementById("education").value = profile.education || "";
            document.getElementById("skills").value = profile.skills || "";
            document.getElementById("email").value = profile.email || "";
            document.getElementById("portfolio").value = profile.portfolio || "";
            document.getElementById("personal_summaries").value = profile.personal_summary || "";

            const fieldsContainer = document.getElementById("fields-container");
            fieldsContainer.innerHTML = "";

            for (const [key, value] of Object.entries(profile)) {
                if (key.startsWith("custom-field")) {
                    const input = document.createElement("input");
                    input.className = "custom-field";
                    input.value = value;
                    fieldsContainer.appendChild(input);
                }
            }
        } else {
            console.error("No active profile or profiles array is empty.");
        }
        
    });
}

function showProfileForm(title, profile, index){
    document.getElementById("formTitle").textContent = title;
    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("name").value = profile.data?.name || "";
    document.getElementById("email").value = profile.data?.email || "";
    document.getElementById("portfolio").value = profile.data?.portfolio || "";
    document.getElementById("personal_summaries").value = profile.data?.personal_summary || "";

    const fieldsContainer = document.getElementById("fields-container");
    fieldsContainer.innerHTML = "";
    if (profile.data){
        for ( const [key, value] of Object.entries(profile.data)){
            if ( key.startsWith("custom-field")) {
                const input = document.createElement("input");
                input.className = "custom-field";
                input.value = value;
                fieldsContainer.appendChild(input);
            }
        }
    }

    document.getElementById("profileForm").style.display = "block";
}


    



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

*/

// let profiles = [];
// let activeProfileIndex = 0;

// chrome.storage.local.get("profiles", (data) => {
//     profiles = data.profiles || [];
//     activeProfileIndex = data.activeProfile || 0;
//     renderProfiles();
//     renderProfileData();
// });

// function renderProfiles() {
//     const profileSelector = document.getElementById("profileSelector");
//     profileSelector.innerHTML = "";

//     profiles.forEach((profile, index) => {
//         const option = document.createElement("option");
//         option.value = index;
//         option.textContent = profile.name;
//         profileSelector.appendChild(option);
//     });

//     profileSelector.value = activeProfileIndex;
// }

// function renderProfileData() {
//     const selectedProfile = profiles[activeProfileIndex];
//     if (selectedProfile) {
//         const profileData = selectedProfile.data;

//         document.getElementById("name").value = profileData.name || "";
//         document.getElementById("experience").value = profileData.experience || "";
//         document.getElementById("education").value = profileData.education || "";
//         document.getElementById("skills").value = profileData.skills || "";
//         document.getElementById("email").value = profileData.email || "";
//         document.getElementById("portfolio").value = profileData.portfolio || "";
//         document.getElementById("personal_summaries").value = profileData.personal_summary || "";

//         const fieldsContainer = document.getElementById("fields-container");
//         fieldsContainer.innerHTML = ""; 
//         Object.entries(profileData).forEach(([key, value]) => {
//             if (key.startsWith("customField")) {
//                 const customFieldDiv = document.createElement("div");
//                 customFieldDiv.innerHTML = `
//                     <label for="${key}">${key}</label>
//                     <input type="text" id="${key}" name="${key}" value="${value}">
//                     <button class="remove-field" data-key="${key}">Remove</button>
//                 `;
//                 fieldsContainer.appendChild(customFieldDiv);
//             }
//         });
//     }
// }

// document.getElementById("saveProfile").addEventListener("click", () => {
//     const profileName = document.getElementById("profileName").value;
//     const profileData = {
//         name: document.getElementById("name").value,
//         experience: document.getElementById("experience").value,
//         education: document.getElementById("education").value,
//         skills: document.getElementById("skills").value,
//         email: document.getElementById("email").value,
//         portfolio: document.getElementById("portfolio").value,
//         personal_summary: document.getElementById("personal_summaries").value,
//     };

//     const fieldsContainer = document.getElementById("fields-container");
//     const customFields = {};
//     fieldsContainer.querySelectorAll("input").forEach(input => {
//         customFields[input.name] = input.value;
//     });

//     profiles[activeProfileIndex] = {
//         name: profileName,
//         data: { ...profileData, ...customFields },
//     };

//     chrome.storage.local.set({ profiles }, () => {
//         alert("Profile saved successfully!");
//         renderProfiles();
//         renderProfileData();
//     });
// });

// document.getElementById("add-field").addEventListener("click", () => {
//     const fieldName = prompt("Enter the custom field name:");
//     if (fieldName) {
//         const fieldsContainer = document.getElementById("fields-container");
//         const customFieldDiv = document.createElement("div");
//         customFieldDiv.innerHTML = `
//             <label for="${fieldName}">${fieldName}</label>
//             <input type="text" id="${fieldName}" name="${fieldName}">
//             <button class="remove-field" data-key="${fieldName}">Remove</button>
//         `;
//         fieldsContainer.appendChild(customFieldDiv);
//     }
// });

// document.getElementById("fields-container").addEventListener("click", (event) => {
//     if (event.target.classList.contains("remove-field")) {
//         const fieldKey = event.target.dataset.key;
//         delete profiles[activeProfileIndex].data[fieldKey];
//         renderProfileData();
//     }
// });

// document.getElementById("profileSelector").addEventListener("change", (event) => {
//     activeProfileIndex = parseInt(event.target.value, 10);
//     chrome.storage.local.set({ activeProfile: activeProfileIndex }, () => {
//         renderProfileData();
//     });
// });

// document.getElementById("newProfile").addEventListener("click", () => {
//     activeProfileIndex = profiles.length;
//     profiles.push({
//         name: "New Profile",
//         data: {},
//     });
//     chrome.storage.local.set({ profiles, activeProfile: activeProfileIndex }, () => {
//         renderProfiles();
//         renderProfileData();
//     });
// });

// document.getElementById("editProfile").addEventListener("click", () => {
//     document.getElementById("profileForm").style.display = "block";
//     const selectedProfile = profiles[activeProfileIndex];
//     document.getElementById("profileName").value = selectedProfile.name;
// });

// document.getElementById("saveProfile").addEventListener("click", () => {
//     const profileName = document.getElementById("profileName").value;
//     const selectedProfile = profiles[activeProfileIndex];
//     selectedProfile.name = profileName;

//     chrome.storage.local.set({ profiles }, () => {
//         renderProfiles();
//         renderProfileData();
//         document.getElementById("profileForm").style.display = "none";
//     });
// });

// document.getElementById("cancelProfile").addEventListener("click", () => {
//     document.getElementById("profileForm").style.display = "none";
// });




document.addEventListener('DOMContentLoaded', () => {
    const profileSelector = document.getElementById('profileSelector');
    const addProfileButton = document.getElementById('addProfile');
    const deleteProfileButton = document.getElementById('deleteProfile');
    const saveProfileDetailsButton = document.getElementById('saveProfileDetails');
    const exportDataButton = document.getElementById('exportData');
    const importDataButton = document.getElementById('importData');
    const applicationDashboard = document.getElementById('applicationDashboard');
  
    const profileNameInput = document.getElementById('profileName');
    const profileSurnameInput = document.getElementById('profileSurname');
    const portfolioLinkInput = document.getElementById('portfolioLink');
    const personalSummaryInput = document.getElementById('personalSummary');
    const certificatesInput = document.getElementById('certificates');
  
    let profiles = {};
    let currentProfile = 'default';
    let applications = [];
  
    chrome.storage.local.get(['profiles', 'applications'], (result) => {
      profiles = result.profiles || { default: {} };
      applications = result.applications || [];
      populateProfileSelector();
      populateProfileDetails();
      populateApplicationDashboard();
    });
  
    profileSelector.addEventListener('change', (event) => {
      currentProfile = event.target.value;
      populateProfileDetails();
    });
  
    function populateProfileSelector() {
      profileSelector.innerHTML = '';
      for (const profileName in profiles) {
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
      }
      if (!profiles[currentProfile]) {
        currentProfile = Object.keys(profiles)[0] || 'default';
      }
      profileSelector.value = currentProfile;
      populateProfileDetails();
    }
  
    function populateProfileDetails() {
      const profileData = profiles[currentProfile] || {};
      profileNameInput.value = profileData.name || '';
      profileSurnameInput.value = profileData.surname || '';
      portfolioLinkInput.value = profileData.portfolio || '';
      personalSummaryInput.value = profileData.summary || '';
      certificatesInput.value = profileData.certificates || '';
    }
  
    function populateApplicationDashboard() {
      applicationDashboard.innerHTML = '';
      applications.forEach((app) => {
        const li = document.createElement('li');
        li.textContent = `${app.companyName} - ${app.jobTitle} (Applied: ${app.date})`;
        applicationDashboard.appendChild(li);
      });
    }
  
    addProfileButton.addEventListener('click', () => {
      const profileName = prompt('Enter profile name:');
      if (profileName && !profiles[profileName]) {
        profiles[profileName] = {};
        currentProfile = profileName;
        chrome.storage.local.set({ profiles }, populateProfileSelector);
      }
    });
  
    deleteProfileButton.addEventListener('click', () => {
      if (currentProfile === 'default') {
        alert('Default profile cannot be deleted.');
        return;
      }
      delete profiles[currentProfile];
      currentProfile = Object.keys(profiles)[0] || 'default';
      chrome.storage.local.set({ profiles }, populateProfileSelector);
    });
  
    saveProfileDetailsButton.addEventListener('click', () => {
      const profileData = {
        name: profileNameInput.value,
        surname: profileSurnameInput.value,
        portfolio: portfolioLinkInput.value,
        summary: personalSummaryInput.value,
        certificates: certificatesInput.value,
      };
      profiles[currentProfile] = profileData;
      chrome.storage.local.set({ profiles }, () => {
        alert('Profile details saved successfully!');
      });
    });
  
    exportDataButton.addEventListener('click', () => {
      const data = { profiles, applications };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({ url, filename: 'form-filler-data.json' });
    });
  
    importDataButton.addEventListener('click', () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          profiles = data.profiles || {};
          applications = data.applications || [];
          chrome.storage.local.set({ profiles, applications }, () => {
            populateProfileSelector();
            populateApplicationDashboard();
          });
        };
        reader.readAsText(file);
      });
      fileInput.click();
    });
  });