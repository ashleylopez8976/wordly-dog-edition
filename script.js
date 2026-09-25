const searchForm = document.querySelector("#search-form");
const wordInput = document.querySelector("#word-input");
const message = document.querySelector("#message");
const results = document.querySelector("#results");
const resultBreed = document.querySelector("#result-breed");
const dogPhoto = document.querySelector("#dog-photo");

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const breed = wordInput.value.trim().toLowerCase();

  if (!breed) {
    message.textContent = "Please enter a dog breed.";
    return;
  }

  message.textContent = "Searching...";
  results.hidden = true;

  try {
    const url = `https://dog.ceo/api/breed/${encodeURIComponent(breed)}/images/random`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000)
    });
    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(`No photos found for "${breed}". Try another breed.`);
    }

    resultBreed.textContent =
      breed.charAt(0).toUpperCase() + breed.slice(1);
    dogPhoto.src = data.message;
    dogPhoto.alt = `A ${breed} dog`;

    message.textContent = "";
    results.hidden = false;
  } catch (error) {
    message.textContent =
      error.name === "TimeoutError"
        ? "The dog photo request took too long. Please try again."
        : error.message;
  }
});

const saveBreedButton = document.querySelector("#save-breed");
const savedBreedsList = document.querySelector("#saved-words");

let savedBreeds = JSON.parse(localStorage.getItem("savedBreeds")) || [];

function showSavedBreeds() {
  savedBreedsList.replaceChildren();

  for (const breed of savedBreeds) {
    const listItem = document.createElement("li");
    listItem.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
    savedBreedsList.append(listItem);
  }
}

saveBreedButton.addEventListener("click", function () {
  const breed = resultBreed.textContent.toLowerCase();

  if (savedBreeds.includes(breed)) {
    message.textContent = `${resultBreed.textContent} is already saved.`;
    return;
  }

  savedBreeds.push(breed);
  localStorage.setItem("savedBreeds", JSON.stringify(savedBreeds));
  showSavedBreeds();

  results.classList.add("saved");
  saveBreedButton.textContent = "Saved!";
  message.textContent = `${resultBreed.textContent} added to Saved Breeds.`;
});

showSavedBreeds();