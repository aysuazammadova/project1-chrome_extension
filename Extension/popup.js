document.getElementById('saveData').addEventListener('click', () => {
  const userData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      portfolio: document.getElementById('portfolio').value
  };
  chrome.storage.local.set({ 'userData': userData }, () => {
      console.log('User data saved.');
  });
});

document.getElementById('fillForm').addEventListener('click', () => {
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
