// Initialize Parse
Parse.initialize(
  "fJdH7sVkUDqc6DKnTP8pn74MAgJtDMH8GZaxIXP3",
  "Jolo5FvOIS48u8aRHkC2alcI3mOVv9JUFswssZ2R"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// Define Parse object for Characters
const Characters = Parse.Object.extend("Characters");

// Function to show loading indicator
function showLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
}

// Function to hide loading indicator
function hideLoading() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "none";
}

// Function to upload a character
function uploadCharacter() {
  showLoading();

  const fileInput = document.getElementById("fileInput");
  const nameInput = document.getElementById("nameInput");
  const file = fileInput.files[0];

  if (file && nameInput.value.trim() !== "") {
    const parseFile = new Parse.File("profile.jpg", file);

    parseFile
      .save()
      .then(() => {
        const character = new Characters();
        character.set("Character", nameInput.value.trim());
        character.set("Profile", parseFile);
        return character.save();
      })
      .then(() => {
        console.log("Character uploaded successfully!");
        updateCardData();
      })
      .catch((error) => {
        console.error("Error uploading character:", error);
      })
      .finally(() => {
        hideLoading();
      });
  } else {
    console.error("Please select a file and enter a character name");
    hideLoading();
  }
}

// Query and update card content
function updateCardData() {
  showLoading();

  const query = new Parse.Query(Characters);

  query
    .find()
    .then((characters) => {
      const cardContainer = document.getElementById("cardContainer");

      // Clear previous content
      cardContainer.innerHTML = "";

      // Update card content
      characters.forEach((character) => {
        const name = character.get("Character");
        const imageUrl = character.get("Profile").url();

        // Create wrapper div
        const wrapperDiv = document.createElement("div");

        // Create card elements
        const cardDiv = document.createElement("div");
        cardDiv;
        cardDiv.className = "ATGcard";

        const imageElement = document.createElement("img");
        imageElement.className = "ATGcard-img";
        imageElement.src = imageUrl;
        imageElement.alt = name;

        const nameElement = document.createElement("p");
        nameElement.className = "ATGcard-name";
        nameElement.textContent = name;

        // Append image and name to the card div
        cardDiv.appendChild(imageElement);

        // Append the card div to the wrapper div
        wrapperDiv.appendChild(cardDiv);
        wrapperDiv.appendChild(nameElement);

        // Append the wrapper div to the card container
        cardContainer.appendChild(wrapperDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching data: " + error.message);
      alert("Error fetching data. Please try again.");
    })
    .finally(() => {
      hideLoading();
    });

  document.getElementById("nameInput").value = "";
  document.getElementById("fileInput").value = "";
}

// Call the function to update card data when the page loads
updateCardData();

// --------------- End of Upload    ---------------
