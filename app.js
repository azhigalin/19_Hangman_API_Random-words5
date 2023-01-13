let key = config.MY_KEY;
const wordE1 = document.getElementById("word"),
  wrongLettersE1 = document.getElementById("wrong-letters"),
  playAgainBtn = document.getElementById("play-button"),
  popup = document.getElementById("popup-container"),
  notification = document.getElementById("notification-gitcontainer"),
  finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

const correctLetters = [];
const wrongLetters = [];

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": key,
    "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
  },
};

fetch("https://random-words5.p.rapidapi.com/getMultipleRandom?count=5", options)
  .then((response) => response.json())
  .then((data) => {
    let selectedWord = data[Math.floor(Math.random() * data.length)];

    displayWord();

    //Show hidden word
    function displayWord() {
      wordE1.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
        </span>
        `
      )
      .join("")}
    `;

      const innerWord = wordE1.innerText.replace(/\n/g, "");

      if (innerWord === selectedWord) {
        finalMessage.innerText = "Congratulations! You won! 😃";
        popup.style.display = "flex";
      }
    }

    // Update the wrong letters
    function updateWrongLetterE1() {
      //Display wrong letters
      wrongLettersE1.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;

      //Display parts
      figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
          part.style.display = "block";
        } else {
          part.style.display = "none";
        }
      });

      //Check if lost
      if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = "Unfortunately you lost. 😕";
        popup.style.display = "flex";
      }
    }

    //Show notification
    function showNotification() {
      notification.classList.add("show");

      setTimeout(() => {
        notification.classList.remove("show");
      }, 2000);
      4;
    }

    //Keydown letter press
    window.addEventListener("keydown", (e) => {
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;

        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            correctLetters.push(letter);

            displayWord();
          } else {
            showNotification();
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);

            updateWrongLetterE1();
          } else {
            showNotification();
          }
        }
      }
    });

    //Restart game and play again
    playAgainBtn.addEventListener("click", () => {
      //Empty arrays
      correctLetters.splice(0);
      wrongLetters.splice(0);
      fetch(
        "https://random-words5.p.rapidapi.com/getMultipleRandom?count=5",
        options
      )
        .then((response) => response.json())
        .then((data) => {
          selectedWord = data[Math.floor(Math.random() * data.length)];

          displayWord();

          updateWrongLetterE1();

          popup.style.display = "none";
        });
    });
  })
  .catch((err) => console.error(err));
