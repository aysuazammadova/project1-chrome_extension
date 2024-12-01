document.addEventListener('DOMContentLoaded', () => {
    const profileSelector = document.getElementById('profileSelector');
    const addProfileButton = document.getElementById('addProfile');
    const deleteProfileButton = document.getElementById('deleteProfile');
    const saveProfileDetailsButton = document.getElementById('saveProfileDetails');
    const exportDataButton = document.getElementById('exportData');
    const importDataButton = document.getElementById('importData');
    const emailDataButton = document.getElementById('emailData');
    const applicationDashboard = document.getElementById('applicationDashboard');
    const addJobApplicationButton = document.getElementById("addJobApplication");
    const restoreJobApplicationButton = document.getElementById("restoreJobApplications");
    const importDataInput = document.getElementById('importDataInput');
  
    const profileNameInput = document.getElementById('profileName');
    const profileSurnameInput = document.getElementById('profileSurname');
    const portfolioLinkInput = document.getElementById('portfolioLink');
    const personalSummaryInput = document.getElementById('personalSummary');
    const certificatesInput = document.getElementById('certificates');
  
    let profiles = {};
    let currentProfile = 'default';
    let applications = [];
    let mappings = [];
    let savedForms = [];  

    chrome.storage.local.get(['profiles', 'applications', 'mappings', 'savedForms'], (result) => {
      profiles = result.profiles || { default: {} };
      applications = result.applications || [];
      mappings = result.mappings || [];
      savedForms = result.savedForms || [];


      populateProfileSelector();
      populateProfileDetails();
      populateApplicationDashboard();
      populateMappingList();
      populateSavedFormsList();
  
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
      applications.forEach((app, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <strong>${app.companyName}</strong> - ${app.jobTitle}<br>
            <small>Date Applied: ${app.date} | Status: ${app.status}</small>
          </div>
          <button class="deleteApplication" data-index="${index}">Delete</button>
        `;
        applicationDashboard.appendChild(li);
      });
  
      document.querySelectorAll('.deleteApplication').forEach((button) => {
        button.addEventListener('click', (event) => {
          const index = event.target.dataset.index;
          applications.splice(index, 1);
          chrome.storage.local.set({ applications }, populateApplicationDashboard);
        });
      });
    }

    function populateSavedFormsList(){
        const savedFormsList = document.getElementById("savedFormsList");
        savedFormsList.innerHTML = '';
        savedForms.forEach((form, index) =>{
            const li = document.createElement('li');
            li.textContent = `${form.jobTitle} at ${form.companyName} (Saved on: ${form.dateApplied})`;

            const restoreButton = document.createElement('button');
            restoreButton.textContent = "Restore";
            restoreButton.addEventListener("click", () =>{
                restoreSavedForm(form);
            });

            li.appendChild(restoreButton);
            savedFormsList.appendChild(li);
        });
    }
  
    function restoreSavedForm(formData){
        const jobTitleInput = document.getElementById("jobTitle");
        const companyNameInput = document.getElementById("companyName");
        const dateAppliedInput = document.getElementById("dateApplied");
        const statusInput = document.getElementById("status");

        jobTitleInput.value = formData.jobTitle;
        companyNameInput.value = formData.companyName;
        dateAppliedInput.value = formData.dateApplied;
        statusInput.value = formData.status;

        alert("Form restored! You can now continue filling out the application.");
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
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'form-filler-data.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  
    importDataButton.addEventListener('click', () => {
      importDataInput.click(); 
    });
  
    importDataInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedData = JSON.parse(reader.result);
          profiles = importedData.profiles || {};
          applications = importedData.applications || [];
          chrome.storage.local.set({ profiles, applications }, () => {
            alert('Data imported successfully!');
            populateProfileSelector();
            populateApplicationDashboard();
          });
        } catch (error) {
          alert('Failed to import data. Ensure the file is valid JSON.');
        }
      };
      reader.readAsText(file);
    });
  
    emailDataButton.addEventListener('click', () => {
      const data = { profiles, applications };
      const recipientEmail = prompt('Enter recipient email address:');
      if (!recipientEmail) {
        alert('Email address is required.');
        return;
      }
  
      const mailtoLink = `mailto:${recipientEmail}?subject=Form%20Filler%20Data&body=${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      window.location.href = mailtoLink;
    });
  
    addJobApplicationButton.addEventListener('click', () => {
      const jobTitle = prompt('Enter job title:');
      const companyName = prompt('Enter company name:');
      const dateApplied = prompt('Enter date applied (YYYY-MM-DD):');
      const status = prompt('Enter application status (e.g., Applied, Interviewing, Hired):');
  
      if (jobTitle && companyName && dateApplied && status) {
        applications.push({ jobTitle, companyName, date: dateApplied, status });
        chrome.storage.local.set({ applications }, populateApplicationDashboard);
      } else {
        alert('Please fill in all fields.');
      }
    });

    restoreJobApplicationButton.addEventListener("click", () =>{
        populateApplicationDashboard();
    });
});
});