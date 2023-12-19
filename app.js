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

function resizeAndUpload() {
  showLoading();

  var input = document.getElementById("fileInput");
  var file = input.files[0];
  var nameInput = document.getElementById("nameInput");
  var characterName = nameInput.value;

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var img = new Image();
      img.src = e.target.result;

      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        // Set the desired width and height for the resized image
        var targetWidth = 350;
        var targetHeight = 300;

        // Resize the image while maintaining the aspect ratio
        var width = img.width;
        var height = img.height;
        var aspectRatio = width / height;

        if (width > height) {
          height = targetWidth / aspectRatio;
          width = targetWidth;
        } else {
          width = targetHeight * aspectRatio;
          height = targetHeight;
        }

        // Set the canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the resized image on the canvas
        // ctx.drawImage(img, 0, 0, width, height);
        // ctx.drawImage(img, 0, targetHeight - height, width, height);

        // Draw the resized image on the canvas, anchored to the bottom center
        var x = (targetWidth - width) / 2; // Center the image horizontally
        var y = targetHeight - height; // Anchor the image to the bottom
        ctx.drawImage(img, x, y, width, height);

        // Get the resized data URL
        var resizedDataUrl = canvas.toDataURL("image/png");

        // Upload the resized image to Parse
        uploadCharacterToParse(characterName, resizedDataUrl);
      };
    };

    reader.readAsDataURL(file);
  }
}

function uploadCharacterToParse(characterName, dataUrl) {
  showLoading();

  // Initialize Parse
  Parse.initialize(
    "fJdH7sVkUDqc6DKnTP8pn74MAgJtDMH8GZaxIXP3",
    "Jolo5FvOIS48u8aRHkC2alcI3mOVv9JUFswssZ2R"
  );
  Parse.serverURL = "https://parseapi.back4app.com/";

  // Create a new Parse File with the modified image data
  var file = new Parse.File("image.png", { base64: dataUrl });

  // Save the file to Parse
  file.save().then(
    function () {
      // The file has been saved successfully.
      // Now, you can save other data to Parse, referencing this file.

      // Create a new Parse Object for the "Characters" table
      var Character = Parse.Object.extend("Characters");
      var character = new Character();

      // Set properties of the character object
      character.set("Character", characterName);
      character.set("Profile", file);

      // Save the character object to Parse
      character.save().then(
        function () {
          console.log("Character saved with image:", file.url());
          updateCardData();
        },
        function (error) {
          console.error("Error saving character: ", error);
        }
      );
    },
    function (error) {
      // The file either could not be read, or could not be saved to Parse.
      console.error("Error saving file to Parse: ", error);
      hideLoading();
    }
  );
}

// Function to upload a character
// function uploadCharacter() {
//   showLoading();

//   const fileInput = document.getElementById("fileInput");
//   const nameInput = document.getElementById("nameInput");
//   const file = fileInput.files[0];

//   if (file && nameInput.value.trim() !== "") {
//     const parseFile = new Parse.File("profile.jpg", file);

//     parseFile
//       .save()
//       .then(() => {
//         const character = new Characters();
//         character.set("Character", nameInput.value.trim());
//         character.set("Profile", parseFile);
//         return character.save();
//       })
//       .then(() => {
//         console.log("Character uploaded successfully!");
//         updateCardData();
//       })
//       .catch((error) => {
//         console.error("Error uploading character:", error);
//       })
//       .finally(() => {
//         hideLoading();
//       });
//   } else {
//     console.error("Please select a file and enter a character name");
//     hideLoading();
//   }
// }

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

// --------------- Start of Sign Up ---------------

// Create a new User
async function createParseUser() {
  // Creates a new Parse "User" object, which is created by default in your Parse app
  let user = new Parse.User();
  // Set the input values to the new "User" object
  user.set("username", document.getElementById("usernameRegister").value);
  user.set("email", document.getElementById("emailRegister").value);
  user.set("password", document.getElementById("passwordRegister").value);
  try {
    // Call the save method, which returns the saved object if successful
    user = await user.save();
    if (user !== null) {
      // Notify the success by getting the attributes from the "User" object, by using the get method (the id attribute needs to be accessed directly, though)

      // Add the attribute to the button with the ID "myDynamicButton"
      var myDynamicButton = document.getElementById("myDynamicButton");
      myDynamicButton.setAttribute("data-bs-dismiss", "modal");
      // alert(
      //   `New object created with success! ObjectId: ${user.id}, ${user.get(
      //     "username"
      //   )}`
      // );
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Add on click listener to call the create parse user function
document
  .getElementById("createButton")
  .addEventListener("click", async function () {
    createParseUser();
  });

// --------------- End of Parse Sign Up ---------------

// --------------- Start of Parse Log In ---------------
// logIn();

function login() {
  // Get values from the form
  var username = document.getElementById("usernamelogin").value;
  var password = document.getElementById("passwordlogin").value;

  // Use Parse.User.logIn method to authenticate
  Parse.User.logIn(username, password, {
    success: function (user) {
      // User successfully logged in
      console.log(
        "User created successful with name: " +
          user.get("username") +
          " and email: " +
          user.get("email")
      );
      alert("Login successful!");
    },
    error: function (user, error) {
      // Login failed
      alert(console.log("Error: " + error.code + " " + error.message));
      console.log("Error: " + error.code + " " + error.message);
      alert("Login failed. Please check your credentials.");
    },
  });
}
