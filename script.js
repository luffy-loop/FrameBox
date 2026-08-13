/* =========================================
   FRAMEBOX 2.0
   CINEMATIC INTERACTION ENGINE
   ========================================= */


/* =========================================
   MOVIE DATA
   ========================================= */

const movies = [

    {
        id: "dark-knight",
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        genre: "Action",
        mood: "intense",
        category: "action",
        image: "images/thedark.jpg",
        description:
            "Batman faces a criminal mastermind whose reign of chaos pushes Gotham and its protector to their limits."
    },

    {
        id: "inception",
        title: "Inception",
        year: 2010,
        rating: 8.8,
        genre: "Sci-Fi",
        mood: "mind",
        category: "mind",
        image: "images/inception.jpg",
        description:
            "A skilled thief enters the dreams of others, where ideas can be stolen, planted and transformed into reality."
    },

    {
        id: "interstellar",
        title: "Interstellar",
        year: 2014,
        rating: 8.6,
        genre: "Sci-Fi",
        mood: "calm",
        category: "sci-fi",
        image: "images/interstellar.jpg",
        description:
            "A team of explorers travels beyond our galaxy in search of a future for humanity."
    },

    {
        id: "avengers",
        title: "Avengers",
        year: 2012,
        rating: 8.0,
        genre: "Action",
        mood: "intense",
        category: "action",
        image: "images/avengers.jpg",
        description:
            "Earth's greatest heroes unite when a threat emerges that no single hero can face alone."
    },

    {
        id: "dune",
        title: "Dune",
        year: 2021,
        rating: 8.2,
        genre: "Sci-Fi",
        mood: "mind",
        category: "sci-fi",
        image: "images/dune.jpg",
        description:
            "A young heir is drawn into a struggle over a desert world whose resources shape the fate of civilizations."
    }

];


/* =========================================
   DOM
   ========================================= */

const movieGrid =
    document.getElementById("movieGrid");

const watchlistGrid =
    document.getElementById("watchlistGrid");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const watchlistCount =
    document.getElementById("watchlistCount");

const movieModal =
    document.getElementById("movieModal");

const modalBody =
    document.getElementById("modalBody");

const modalClose =
    document.getElementById("modalClose");

const featuredTitle =
    document.getElementById("featuredTitle");

const featuredDescription =
    document.getElementById(
        "featuredDescription"
    );

const featuredWatch =
    document.getElementById("featuredWatch");

const randomMovieButton =
    document.getElementById("randomMovie");

const profileTitle =
    document.getElementById("profileTitle");

const profileDescription =
    document.getElementById(
        "profileDescription"
    );

const tasteBars =
    document.getElementById("tasteBars");


/* =========================================
   STORAGE
   ========================================= */

let watchlist =
    JSON.parse(
        localStorage.getItem("watchlist")
    ) || [];

let lastMovie =
    localStorage.getItem(
        "framebox-last-movie"
    );

let activeFilter = "all";

let currentFeatured =
    movies.find(
        movie => movie.title === lastMovie
    ) || movies[2];


/* =========================================
   HELPERS
   ========================================= */

function saveWatchlist() {

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

}


function getMovie(id) {

    return movies.find(
        movie => movie.id === id
    );

}


/* =========================================
   MOVIE CARD
   ========================================= */

function createMovieCard(movie) {

    const saved =
        watchlist.some(
            item => item.id === movie.id
        );


    const card =
        document.createElement("article");

    card.className =
        "movie-card";


    card.dataset.id =
        movie.id;


    card.innerHTML = `

        <div class="poster">

            <img
                src="${movie.image}"
                alt="${movie.title} poster"
                loading="lazy">

        </div>


        <div class="movie-card-content">

            <h3>
                ${movie.title}
            </h3>


            <div class="movie-meta">

                <span>
                    ${movie.year}
                    ·
                    ${movie.genre}
                </span>

                <span class="rating">
                    ★ ${movie.rating}
                </span>

            </div>


            <button
                class="btn btn-secondary movie-action"
                data-id="${movie.id}">

                ${saved
                    ? "Saved"
                    : "Add to Watchlist"}

            </button>

        </div>

    `;


    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".movie-action"
                )
            ) {

                toggleWatchlist(
                    movie.id
                );

                return;

            }


            openMovieModal(
                movie.id
            );

        }
    );


    return card;

}


/* =========================================
   RENDER MOVIES
   ========================================= */

function renderMovies() {

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let filtered =
        movies.filter(movie => {

            const matchesSearch =
                !search ||
                movie.title
                    .toLowerCase()
                    .includes(search) ||
                movie.genre
                    .toLowerCase()
                    .includes(search) ||
                movie.mood
                    .toLowerCase()
                    .includes(search);


             let matchesFilter = true;

if (activeFilter === "all") {

    matchesFilter = true;

} else if (activeFilter === "rating-9") {

    matchesFilter = movie.rating >= 9;

} else if (activeFilter === "rating-8") {

    matchesFilter = movie.rating >= 8;

} else {

    matchesFilter =
        movie.category === activeFilter;

}


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    movieGrid.innerHTML = "";


    if (filtered.length === 0) {

        movieGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    padding: 60px 20px;
                    text-align: center;
                ">

                <p>
                    No films found in this collection.
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(movie => {

        movieGrid.appendChild(
            createMovieCard(movie)
        );

    });

}


/* =========================================
   SEARCH
   ========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderMovies
    );

}


/* =========================================
   FILTERS
   ========================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            activeFilter =
                button.dataset.filter;


            filterButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            renderMovies();

        }
    );

});


/* =========================================
   WATCHLIST
   ========================================= */

function toggleWatchlist(id) {

    const movie =
        getMovie(id);


    if (!movie) return;


    const existingIndex =
        watchlist.findIndex(
            item => item.id === id
        );


    if (existingIndex >= 0) {

        watchlist.splice(
            existingIndex,
            1
        );

    } else {

        watchlist.push(movie);

    }


    saveWatchlist();

    renderMovies();

    renderWatchlist();

    updateTasteProfile();

}


/* =========================================
   RENDER WATCHLIST
   ========================================= */

function renderWatchlist() {

    if (!watchlistGrid) return;


    watchlistGrid.innerHTML = "";


    if (
        watchlist.length === 0
    ) {

        watchlistGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    padding: 60px 20px;
                    border: 1px solid rgba(255,255,255,.08);
                    border-radius: 18px;
                ">

                <p>
                    Your watchlist is empty.
                    Find something worth saving.
                </p>

            </div>

        `;

    } else {

        watchlist.forEach(
            movie => {

                watchlistGrid.appendChild(
                    createMovieCard(movie)
                );

            }
        );

    }


    if (watchlistCount) {

        watchlistCount.textContent =
            `${watchlist.length} ${
                watchlist.length === 1
                    ? "film"
                    : "films"
            } saved`;

    }

}

/* =========================================
   WATCHLIST EDITOR
   ========================================= */

const editWatchlistBtn =
    document.getElementById(
        "editWatchlistBtn"
    );

const watchlistEditor =
    document.getElementById(
        "watchlistEditor"
    );

const removeSelectedBtn =
    document.getElementById(
        "removeSelectedBtn"
    );

const clearWatchlistBtn =
    document.getElementById(
        "clearWatchlistBtn"
    );

const doneEditingBtn =
    document.getElementById(
        "doneEditingBtn"
    );

const selectedCount =
    document.getElementById(
        "selectedCount"
    );


function updateSelectedCount() {

    if (!watchlistGrid) return;

    const selected =
        watchlistGrid.querySelectorAll(
            ".movie-card.selected"
        );

    if (selectedCount) {

        selectedCount.textContent =
            `${selected.length} selected`;

    }

}


function enterWatchlistEditMode() {

    watchlistGrid.classList.add(
        "editing"
    );

    watchlistEditor.hidden = false;

    editWatchlistBtn.textContent =
        "Exit Editing";

    updateSelectedCount();

}


function exitWatchlistEditMode() {

    watchlistGrid.classList.remove(
        "editing"
    );

    watchlistGrid
        .querySelectorAll(
            ".movie-card.selected"
        )
        .forEach(card => {

            card.classList.remove(
                "selected"
            );

        });

    watchlistEditor.hidden = true;

    editWatchlistBtn.textContent =
        "Edit Watchlist";

    updateSelectedCount();

}


if (editWatchlistBtn) {

    editWatchlistBtn.addEventListener(
        "click",
        () => {

            if (
                watchlistGrid.classList.contains(
                    "editing"
                )
            ) {

                exitWatchlistEditMode();

            } else {

                enterWatchlistEditMode();

            }

        }
    );

}


if (doneEditingBtn) {

    doneEditingBtn.addEventListener(
        "click",
        exitWatchlistEditMode
    );

}


if (removeSelectedBtn) {

    removeSelectedBtn.addEventListener(
        "click",
        () => {

            const selected =
                watchlistGrid.querySelectorAll(
                    ".movie-card.selected"
                );

            const selectedIds =
                [...selected].map(
                    card =>
                        card.dataset.watchlistId
                );

            if (
                selectedIds.length === 0
            ) {

                return;

            }

            watchlist =
                watchlist.filter(
                    movie =>
                        !selectedIds.includes(
                            movie.id
                        )
                );

            saveWatchlist();

            renderWatchlist();

            renderMovies();

            updateTasteProfile();

        }
    );

}


if (clearWatchlistBtn) {

    clearWatchlistBtn.addEventListener(
        "click",
        () => {

            if (!watchlist.length) {
                return;
            }

            const confirmed =
                confirm(
                    "Clear your entire watchlist?"
                );

            if (!confirmed) {
                return;
            }

            watchlist = [];

            saveWatchlist();

            renderWatchlist();

            renderMovies();

            updateTasteProfile();

            exitWatchlistEditMode();

        }
    );

}


/* =========================================
   MOVIE MODAL
   ========================================= */

function openMovieModal(id) {

    const movie =
        getMovie(id);


    if (!movie || !movieModal) {
        return;
    }


    const saved =
        watchlist.some(
            item => item.id === id
        );


    modalBody.innerHTML = `

        <div
            style="
                display:grid;
                grid-template-columns:
                    minmax(180px, 260px) 1fr;
                gap:32px;
                align-items:start;
            ">

            <img
                src="${movie.image}"
                alt="${movie.title} poster"
                style="
                    width:100%;
                    border-radius:14px;
                    aspect-ratio:2/3;
                    object-fit:cover;
                ">


            <div>

                <span class="section-label">
                    ${movie.genre}
                </span>


                <h2
                    style="
                        font-size:clamp(
                            2.8rem,
                            6vw,
                            5rem
                        );
                        line-height:.95;
                        margin-bottom:16px;
                    ">

                    ${movie.title}

                </h2>


                <div
                    style="
                        display:flex;
                        gap:16px;
                        flex-wrap:wrap;
                        color:#aaa;
                        margin-bottom:22px;
                    ">

                    <span>
                        ${movie.year}
                    </span>

                    <span>
                        ★ ${movie.rating}
                    </span>

                    <span>
                        ${movie.mood}
                    </span>

                </div>


                <p
                    style="
                        max-width:580px;
                        margin-bottom:28px;
                    ">

                    ${movie.description}

                </p>


                <button
                    class="btn btn-primary"
                    id="modalWatchlist">

                    ${
                        saved
                            ? "Remove from watchlist"
                            : "Add to watchlist"
                    }

                </button>

            </div>

        </div>

    `;


    const modalWatchlist =
        document.getElementById(
            "modalWatchlist"
        );


    modalWatchlist.addEventListener(
        "click",
        () => {

            toggleWatchlist(id);

            openMovieModal(id);

        }
    );


    movieModal.classList.add(
        "open"
    );

    movieModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================
   CLOSE MODAL
   ========================================= */

function closeMovieModal() {

    if (!movieModal) return;


    movieModal.classList.remove(
        "open"
    );

    movieModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeMovieModal
    );

}


if (movieModal) {

    movieModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                movieModal
            ) {

                closeMovieModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMovieModal();

        }

    }
);


/* =========================================
   FEATURED MOVIE
   ========================================= */

function renderFeatured(movie) {

    if (!movie) return;


    currentFeatured =
        movie;
     const featured =
    document.getElementById("featuredMovie");

if (featured) {

    featured.style.backgroundImage =
        `url("${movie.image}")`;

}

    if (featuredTitle) {

        featuredTitle.textContent =
            movie.title;

    }


    if (featuredDescription) {

        featuredDescription.textContent =
            movie.description;

    }

}


if (featuredWatch) {

    featuredWatch.addEventListener(
        "click",
        () => {

            openMovieModal(
                currentFeatured.id
            );

        }
    );

}


if (randomMovieButton) {

    randomMovieButton.addEventListener(
        "click",
        () => {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    movies.length
                );


            renderFeatured(
                movies[randomIndex]
            );

        }
    );

}


/* =========================================
   TASTE PROFILE
   ========================================= */

function updateTasteProfile() {

    if (
        !profileTitle ||
        !profileDescription
    ) {

        return;

    }


    if (watchlist.length === 0) {

        profileTitle.innerHTML =
            'The <span>Explorer.</span>';

        profileDescription.textContent =
            "Start saving films and FrameBox will begin building a picture of your cinematic taste.";

        return;

    }


    const moodCount = {};


    watchlist.forEach(movie => {

    const card =
        createMovieCard(movie);

    card.dataset.watchlistId =
        movie.id;

    card.addEventListener(
        "click",
        event => {

            if (
                !watchlistGrid.classList.contains(
                    "editing"
                )
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".movie-action"
                )
            ) {
                return;
            }

            card.classList.toggle(
                "selected"
            );

            updateSelectedCount();

        }
    );

    watchlistGrid.appendChild(card);

});


    const sortedMoods =
        Object.entries(
            moodCount
        ).sort(
            (a,b) => b[1] - a[1]
        );


    const dominantMood =
        sortedMoods[0][0];


    const profileMap = {

        intense: {
            title: "The <span>Adrenaline Seeker.</span>",
            description:
                "You gravitate toward high-stakes stories, powerful characters and films that never sit still."
        },

        mind: {
            title: "The <span>Explorer.</span>",
            description:
                "You seem drawn to stories that create questions, twist expectations and stay with you after the credits."
        },

        calm: {
            title: "The <span>Dreamer.</span>",
            description:
                "You enjoy atmospheric journeys, emotional stories and films that give you space to think."
        }

    };


    const profile =
        profileMap[dominantMood] ||
        profileMap.mind;


    profileTitle.innerHTML =
        profile.title;


    profileDescription.textContent =
        profile.description;


    updateTasteBars();

}


function updateTasteBars() {

    if (!tasteBars) return;


    const counts = {};


    watchlist.forEach(movie => {

        counts[movie.category] =
            (counts[movie.category] || 0) +
            1;

    });


    const total =
        watchlist.length || 1;


    const rows =
        tasteBars.querySelectorAll(
            ".taste-row"
        );


    const categories = [
        "sci-fi",
        "thriller",
        "drama",
        "action"
    ];


    rows.forEach(
        (row, index) => {

            const category =
                categories[index];

            const percentage =
                Math.round(
                    (
                        (counts[category] || 0)
                        /
                        total
                    ) * 100
                );


            const label =
                row.querySelector(
                    ".taste-label"
                );


            const bar =
                row.querySelector(
                    ".taste-bar span"
                );


            if (label) {

                label.children[1]
                    .textContent =
                    `${percentage}%`;

            }


            if (bar) {

                bar.style.width =
                    `${percentage}%`;

            }

        }
    );

}


/* =========================================
   LAST WATCHED
   ========================================= */

function markWatched(movie) {

    if (!movie) return;


    lastMovie =
        movie.title;


    localStorage.setItem(
        "framebox-last-movie",
        lastMovie
    );


    renderFeatured(movie);

}


/* =========================================
   CARD WATCH TRACKING
   ========================================= */

document.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                ".movie-card"
            );


        if (!card) return;


        const id =
            card.dataset.id;


        const movie =
            getMovie(id);


        if (movie) {

            markWatched(movie);

        }

    }
);


/* =========================================
   SCROLL REVEAL
   ========================================= */

const revealElements =
    document.querySelectorAll(
        ".section-heading, " +
        ".featured, " +
        ".profile-panel, " +
        ".movie-card"
    );


revealElements.forEach(
    element => {

        element.classList.add(
            "reveal"
        );

    }
);


if (
    "IntersectionObserver"
    in window
) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.classList.add(
                            "visible"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.add(
                "visible"
            );

        }
    );

}


/* =========================================
   INITIALIZE
   ========================================= */

renderMovies();

renderWatchlist();

updateTasteProfile();

renderFeatured(
    currentFeatured
);