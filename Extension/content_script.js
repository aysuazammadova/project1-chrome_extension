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