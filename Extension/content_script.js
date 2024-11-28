
function autofillForm(){
    chrome.storage.local.get(["profiles", "activeProfile"], (data) => {
        const profiles = data.profiles || [];
        const activeProfileIndex = data.activeProfile ?? 0;
        const selectedProfile = profiles[activeProfileIndex];


        if (selectedProfile) {
            const profileData = selectedProfile.data;

            const inputs = document.querySelectorAll("input, textarea, select");
            inputs.forEach((input) => {
                if (input.name === "name") input.value = profileData.name || "";
                if (input.name === "experience") input.value = profileData.experience || "";
                if (input.name === "education") input.value = profileData.education || "";
                if (input.name === "skills") input.value = profileData.skills || "";
                if (input.name === "email") input.value = profileData.email || "";
                if (input.name === "portfolio") input.value = profileData.portfolio || "";
                if (input.name === "personal_summaries") input.value = profileData.personal_summary || "";
            });

            for (const [key, value] of Object.entries(profileData)){
                if (key.startsWith("customField")){
                    const customInput = document.querySelector(`[name="${key}"]`);
                    if (customInput) customInput.value = value;
                }
            }
        } else {
            console.error('No profile selected or profiles are empty.');
        }
    });
}
function autofillForm() {
  chrome.storage.local.get('userData', (data) => {
    if (data.userData && data.userData.mappings) {
      const mappings = data.userData.mappings;
      mappings.forEach(mapping => {
        const formElement = document.querySelector(`[name="${mapping.formField}"]` || `[id="${mapping.formField}"]`);
        if (formElement && data.userData[mapping.storedField]) {
          formElement.value = data.userData[mapping.storedField];
        }
      });
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "fillForm") {
      autofillForm();
    }
  }
);
