const body = document.body;
const themeSelect = document.getElementById("theme");
const sortSelect = document.getElementById("sort");
const searchInput = document.getElementById("search");
const cards = Array.from(document.querySelectorAll(".movie-card"));
const watchButtons = document.querySelectorAll(".watch");
const list = document.getElementById("list");
const continueCard = document.getElementById("continue-card");
const tasteText = document.getElementById("taste-text");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let lastMovie = localStorage.getItem("lastMovie");
let preferences = JSON.parse(localStorage.getItem("preferences")) || {
    theme: "dark",
    sort: "default",
    search: ""
};

body.className = preferences.theme;
themeSelect.value = preferences.theme;
sortSelect.value = preferences.sort;
searchInput.value = preferences.search;

function savePreferences() {
    localStorage.setItem("preferences", JSON.stringify(preferences));
}

themeSelect.onchange = () => {
    body.className = themeSelect.value;
    preferences.theme = themeSelect.value;
    savePreferences();
};

searchInput.oninput = () => {
    preferences.search = searchInput.value;
    savePreferences();
    filterMovies();
};

sortSelect.onchange = () => {
    preferences.sort = sortSelect.value;
    savePreferences();
    sortMovies();
};

function filterMovies() {
    const value = searchInput.value.toLowerCase();
    cards.forEach(card => {
        card.style.display = card.dataset.title.toLowerCase().includes(value)
            ? "block"
            : "none";
    });
}

function sortMovies() {
    let sorted = [...cards];
    if (sortSelect.value === "high") {
        sorted.sort((a, b) => b.dataset.rating - a.dataset.rating);
    }
    if (sortSelect.value === "low") {
        sorted.sort((a, b) => a.dataset.rating - b.dataset.rating);
    }
    sorted.forEach(card => document.getElementById("movies").appendChild(card));
}

function renderWatchlist() {
    list.innerHTML = "";
    watchlist.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        list.appendChild(li);
    });
    updateTasteProfile();
}

function updateTasteProfile() {
    if (watchlist.length === 0) return;

    const moodCount = {};
    watchlist.forEach(movie => {
        moodCount[movie.mood] = (moodCount[movie.mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCount)
        .reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);

    tasteText.textContent =
        "You mostly enjoy " + dominantMood + " movies.";
}

watchButtons.forEach(btn => {
    btn.onclick = () => {
        const card = btn.parentElement;
        const movie = {
            title: card.dataset.title,
            mood: card.dataset.mood,
            rating: card.dataset.rating
        };

        lastMovie = movie.title;
        localStorage.setItem("lastMovie", lastMovie);

        if (!watchlist.some(m => m.title === movie.title)) {
            watchlist.push(movie);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));
        }

        renderWatchlist();
        showContinueWatching();
    };
});

function showContinueWatching() {
    if (!lastMovie) return;
    continueCard.textContent = lastMovie;
}

filterMovies();
sortMovies();
renderWatchlist();
showContinueWatching();
