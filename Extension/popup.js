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

/*
    document.getElementById('save-data').addEventListener('click', () => {
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            portfolio: document.getElementById('portfolio').value
        };

    chrome.storage.local.get("activeProfile", (data) =>{
        const activeProfileIndex = data.activeProfile || 0;
        chrome.storage.local.get("profiles", (profileData) => {
            const profiles = profileData.profiles || [];
            profiles[activeProfileIndex].data = userData;
            chrome.storage.local.set({ profiles });
            console.log('User data saved under active profile.');
        });
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

*/
    






