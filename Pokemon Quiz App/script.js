// 1) Get DOM elements

const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// 8) Initialize variables 
let usedPokemonIds = []; 
let count = 0; // 15.3) 
let points = 0; // 15.9)
let showLoading = false; // 15.11) 

// 2) Create function to fetch one Pokemon with an ID

async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data; 

};

// //  3) Create a test function to see result of step 2
// async function testFetch() {
//    const pokemon = await fetchPokemonById(getRandomPokemonId());
//    console.log(pokemon);
//  };

// //  4) Call test function
// testFetch();

// 6) Function to load question with options
async function loadQuestionsWithOptions() {
if(showLoading) {
  hidePuzzleWindow();
  showLoadingWindow();
};  
      // 7) Fetch correct answer first
      let pokemonId = getRandomPokemonId(); 
      // 8.2) Check if current question has already been used
      while (usedPokemonIds.includes(pokemonId))  {
        pokemonId = getRandomPokemonId();
      }
      // 8.3) If pokemon has not been displayed yet, it is added to usedPokemonIds and it is set as a new const pokemon.
      usedPokemonIds.push(pokemonId); 
      const pokemon = await fetchPokemonById(pokemonId);

      // 9) Create options array 
      const options = [pokemon.name];
      const optionsIds = [pokemon.id];

      // 10) Fetch additional random Pokemon names to use as options.
      while (options.length < 4) {
        let randomPokemonId = getRandomPokemonId();
        // 10.1) Ensure fetched option does not exist in the options list. Create a new random id until it does not exist in optionsIds.
        while (optionsIds.includes(randomPokemonId)){
          randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        // 10.2) Fetching a random pokemon with the newly made ID, and adding it to the options array.
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        // 10.3) Test 
        console.log(options);
        console.log(optionsIds);
        
        // 16) Turn off loading if all the options have been fetched.

        if (options.length ===4) {
          showLoading = false;
        } 

      }

      shuffleArray(options);

      // 13) Clear any previous result and update pokemon Image to fetched image URL from the sprites.
      resultElement.textContent = "Who's that Pokemon?";
      pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;   

      // 14) Create options HTML elements with options array in the DOM.
      optionsContainer.innerHTML = "";
      options.forEach((option, index) => {
           const button = document.createElement("button");
           button.textContent = option;
           button.onclick = (event) => checkAnswer(option === pokemon.name, event);
           optionsContainer.appendChild(button);   

      });

      if (!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
      }  
  
}

// 15) Create checkAnswer function
function checkAnswer(isCorrect, event) {
    // 15.1) Check if any button is already selected, if fasle => no element => null 
    const selectedButton = document.querySelector(".selected");

    // 15.2) If already a button is selected, do nothing, exit function. 
    if (selectedButton) {
      return;
    }

    // 15.4) Else mark the clicked button as selected and increase the count by 1.
    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;   
    if (isCorrect) {
      // 15.7) Call displayedResult function 
      displayResult("Correct answer!"); 
      // 15.8) If correct, increase the points by 1
      points++;
      pointsElement.textContent = points; 
      event.target.classList.add("correct");
    } else {
      displayResult("Wrong answer..."); 
      event.target.classList.add("wrong");
    }

    // 15.10) Load the next question with a 1s delay for the user to read the result.
    
    setTimeout(() => {
      showLoading = true;
      loadQuestionsWithOptions();
    }, 1000);

}

// 11) Initial load
loadQuestionsWithOptions();

// --- UTILITY FUNCTIONS ---
// 5) Function to randomize the Pokemon ID
function getRandomPokemonId() {
    return Math.floor(Math.random() * 151) + 1;

}

// 12.1) Shuffle the array we send it
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);

}

// 15.5) Function to update result text and class name 
function displayResult(result) {
  resultElement.textContent = result;

}

// 17) Hide loading window
function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

// 18) Show loading window 
function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}


// 19) Show Puzzle window
function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");

}

// 20) Hide Puzzle window
function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}