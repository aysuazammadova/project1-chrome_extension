function autofillForm() {
  chrome.storage.local.get(["profiles", "activeProfile", "mappings"], (data) => {
    const profiles = data.profiles || [];
    const activeProfileIndex = data.activeProfile ?? 0;
    const selectedProfile = profiles[activeProfileIndex];
    const mappings = data.mappings || [];
    const formHistory = data.formHistory || {};
    const savedData = formHistory[selectedProfile.name] || {};

    if (!selectedProfile) {
      console.error("No active profile found.");
      return;
    }

    const profileData = selectedProfile.data;

    mappings.forEach((mapping) => {
      const formElement = document.querySelector(`[name="${mapping.formField}"]`);
      if (formElement && profileData[mapping.profileField]) {
        formElement.value = profileData[mapping.profileField];
      }
    });

    Object.keys(savedData).forEach((key) =>{
      const formElement = document.querySelector(`[name="${key}"]`);
      if (formElement){
        formElement.value = savedData[key];
      }
    });

    console.log("Form autofill complete.");
  });
}


function storeFormData(){
  chrome.storage.local.get(["activeProfile", "formHistory"], (data)=>{
    const activeProfileIndex = data.activeProfile ?? 0;
    const profiles = data.profiles || [];
    const selectedProfile = profiles[activeProfileIndex];
    const formHistory = data.formHistory || {};

    if (!selectedProfile){
      console.error("No active profile found.");
      return;
    }

    const formData = {};
    const formElements = document.querySelector("input, select, textarea");
    formElements.forEach((element) =>{
      if(element.name){
        formData[element.name] = element.value;
      }
    });

    formHistory[selectedProfile.name] = formData;

    chrome.storage.local.set({formHistory}, () =>{
      console.log("Form data saved for profile:", selectedProfile.name);
    });
  });
}

document.addEventListener("input", storeFormData);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    autofillForm();
  }
});

console.log("Auto Form Filler content script loaded.");
