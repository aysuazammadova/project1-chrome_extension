// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Extension successfully installed');
// });


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({profileData: {}});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "getProfileData") {
    chrome.storage.local.get("profileData", (data) => {
      sendResponse({data: data.profileData});
    });
    return true; 
  }
  else if (request.method === "setProfileData") {
    chrome.storage.local.set({profileData: request.data}, () => {
      sendResponse({status: "Profile data updated"});
    });
    return true; 
  }
});

