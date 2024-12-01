function autofillForm() {
  chrome.storage.local.get(["profiles", "activeProfile", "mappings"], (data) => {
    const profiles = data.profiles || [];
    const activeProfileIndex = data.activeProfile ?? 0;
    const selectedProfile = profiles[activeProfileIndex];
    const mappings = data.mappings || [];

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

    console.log("Form autofill complete.");
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    autofillForm();
  }
});

console.log("Auto Form Filler content script loaded.");
