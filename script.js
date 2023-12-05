const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const mealList = document.getElementById("mealList");
const modalContainer = document.getElementById("modal-container");
const mealDetailsContent = document.getElementById("meal-details-content");
const recipeCloseBtn = document.getElementById("recipeCloseBtn");

// Event Listeners
searchButton.addEventListener("click", async () => {
  const ingredient = searchInput.value.trim();
  if (ingredient) {
    const meals = await searchMealsByIngredient(ingredient);
    displayMeals(meals);
  }
});

mealList.addEventListener("click", async (e) => {
  const card = e.target.closest(".meal-item");
  if (card) {
    const mealId = card.dataset.id;
    const meal = await getMealDetails(mealId);
    if (meal) {
      showMealDeatilsPopup(meal);
    }
  }
});

// Function used to fetch teh meals by ingredients
async function searchMealsByIngredient(ingredient) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const data = await response.json();
    return data.meals;
  } catch (err) {
    // Show thw error in the console
    console.error("Error fetching data:", err);
  }
}

// Function to fetch meal details by ID
async function getMealDeatils(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
  } catch (err) {
    console.error("Error fetching meal details:", err);
  }
}

// Function to display the meals in list
function displayMeals(meals) {
  if (meals) {
    meals.forEach((meal) => {
      const mealItem = document.createElement("div");
      mealItem.classList.add("meal-item");
      mealItem.dataset.id = meal.idMeal;
      mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>`;
      mealList.appendChild(mealItem);
    });
  } else {
    mealList.innerHTML = `
            <p>No meals was found. Try any another ingredient</p>
            `;
  }
}

// Function to show the meal details popup
function showMealDeatilsPopup(meal) {
  // clean it up
  mealDetailsContent.innerHTML = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
    `;
  modalContainer.style.display = "block";
}

// Event listener for popup close button
recipeCloseBtn.addEventListener("click", closeRecipeModal);

// Function to close the popup
function closeRecipeModal() {
  modalContainer.style.display = "none";
}

// Event listener for outside click
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

// Function to perform the search
async function performSearch() {
  const ingredient = searchInput.value.trim();
  if (ingredient) {
    const meals = await searchMealsByIngredient(ingredient);
    displayMeals(meals);
  }
}

// Perform a chicken search on page load
window.addEventListener('load',()=>{
    searchInput.value='chicken';
    performSearch();
})