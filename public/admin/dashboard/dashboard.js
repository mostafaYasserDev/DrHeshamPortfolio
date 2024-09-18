// تهيئة Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
// مرجع Realtime Database
const database = firebase.database();
// مرجع Storage
const storage = firebase.storage();
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // If user is not signed in, redirect to the homepage
    window.location.href = "../../";
  }
});
function createStatusElement(id) {
  const formGroup = document.getElementById(id).parentElement;
  let statusElement = document.getElementById(`${id}-status`);
  if (!statusElement) {
    statusElement = document.createElement("div");
    statusElement.id = `${id}-status`;
    statusElement.className = "status-message";
    formGroup.appendChild(statusElement);
  }
  return statusElement;
}

function showStatusMessage(statusElement, message, color) {
  statusElement.innerText = message;
  statusElement.style.backgroundColor = "white";
  statusElement.style.color = color;
  statusElement.style.opacity = 1;

  setTimeout(() => {
    statusElement.style.opacity = 0;
    setTimeout(() => {
      statusElement.innerText = ""; // Clear message after fade out
    }, 500); // Time to clear message
  }, 1500); // Duration to show message
}

function saveData(path, data, statusElementId, fieldId) {
  const statusElement = createStatusElement(statusElementId);

  database.ref(path).set(data, (error) => {
    if (error) {
      console.error("Failed to save data:", error);
      showStatusMessage(
        statusElement,
        "An error occurred while saving data.",
        "red"
      );
    } else {
      console.log("Data saved successfully!");
      showStatusMessage(statusElement, "Data saved successfully!", "#4CAF50");
      document.getElementById(fieldId).value = ""; // Clear field after successful update
    }
  });
}

function uploadFile(fileInputId, folderPath, callback, statusElementId) {
  const file = document.getElementById(fileInputId).files[0];
  if (!file) {
    const statusElement = createStatusElement(fileInputId);
    showStatusMessage(statusElement, "Please select a file to upload.", "red");
    return;
  }

  const storageRef = storage.ref(`${folderPath}/${file.name}`);
  const uploadTask = storageRef.put(file);

  const statusElement = createStatusElement(statusElementId);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      statusElement.innerText = `Downloading in progress: ${progress.toFixed(
        2
      )}%`;
      statusElement.style.backgroundColor = "white";
      statusElement.style.color = "blue";
      statusElement.style.opacity = 1;
    },
    (error) => {
      console.error("File upload failed:", error);
      showStatusMessage(
        statusElement,
        "An error occurred while uploading the file.",
        "red"
      );
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File uploaded successfully! URL: ", downloadURL);
        callback(downloadURL);
        showStatusMessage(statusElement, "Downloaded successfully!", "#4CAF50");
        document.getElementById(fileInputId).value = ""; // Clear file input after successful upload
      });
    }
  );
}

document.querySelectorAll(".update-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const fieldId = this.previousElementSibling.id;
    const path = `profile/${fieldId}`;
    const statusElementId = fieldId;

    if (fieldId.includes("profile-image") || fieldId.includes("cv")) {
      uploadFile(
        fieldId,
        "files",
        (url) => {
          saveData(path, url, statusElementId, fieldId);
        },
        statusElementId
      );
    } else {
      const value = document.getElementById(fieldId).value;

      if (!value) {
        const statusElement = createStatusElement(fieldId);
        showStatusMessage(statusElement, "The field cannot be empty.", "red");
        return;
      }

      saveData(path, value, statusElementId, fieldId);
    }
  });
});
