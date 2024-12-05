/*
Logic for the home page
Load all the movies from the backend (or at least the movies quried for the homepage)
Functions for the search functions
*/
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); 

  if (!token) {
    alert('You need to log in first!');
    window.location.href = 'index.html'; 
    return;
  }

  const moviesList = document.getElementById('moviesList');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchActorBtn = document.getElementById('searchActorBtn'); 
  const searchActorInput = document.getElementById('searchActorInput');
  const homeBtn = document.getElementById('homeBtn'); 

  // Function to display movies in the UI
  const displayMovies = (movies) => {
    if (movies.length === 0) {
      moviesList.innerHTML = `<p>No movies found. Please try another search.</p>`;
      return;
    }

    moviesList.innerHTML = movies
      .map(
        (movie) => `
          <div class="movie-card" data-id="${movie._id}">
            <img class="movie-poster" src="${movie.poster || 'https://via.placeholder.com/150'}" alt="${movie.title}">
            <h2 class="movie-title">${movie.title}</h2>
          </div>
        `
      )
      .join(''); 

    // Add click event listeners to each movie card
    document.querySelectorAll('.movie-card').forEach((card) => {
      card.addEventListener('click', () => {
        const movieId = card.getAttribute('data-id');
        window.location.href = `movieDetails.html?id=${movieId}`; // Redirect to movie details page
      });
    });
  };

  // Fetch and display all movies
  const fetchAllMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies?limit=100', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies.');
      }

      const movies = await response.json(); 
      displayMovies(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      moviesList.innerText = 'Failed to load movies. Please try again.';
    }
  };

  // Fetch movies for title search
  const fetchMoviesByTitle = async (title) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/getMovieByTitle/${title}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies by title.');
      }

      const movies = await response.json();
      displayMovies(movies);
    } catch (error) {
      console.error('Error fetching movies by title:', error);
      moviesList.innerHTML = `<p>Failed to fetch movies. Please try again.</p>`;
    }
  };

  // Fetch movies for actor search
  const fetchMoviesByActor = async (actor) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/searchActor?actor=${actor}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies by actor.');
      }

      const movies = await response.json();
      displayMovies(movies);
    } catch (error) {
      console.error('Error fetching movies by actor:', error);
      moviesList.innerHTML = `<p>Failed to fetch movies. Please try again later.</p>`;
    }
  };

  // Initial load: Fetch and display all movies
  fetchAllMovies();

  // Handle search button click for movie title
  searchBtn.addEventListener('click', () => {
    const title = searchInput.value.trim();
    if (title) {
      fetchMoviesByTitle(title); 
    } else {
      alert('Please enter a movie title to search');
    }
  });

  // Handle search button click for actor
  searchActorBtn.addEventListener('click', () => {
    const actor = searchActorInput.value.trim();
    if (actor) {
      fetchMoviesByActor(actor); 
    } else {
      alert('Please enter an actor name to search.');
    }
  });

  // Handle "Back to Home" button click
  homeBtn.addEventListener('click', () => {
    fetchAllMovies(); 
  });

  // Logout button functionality
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId')
    window.location.href = 'index.html'; // Redirect to login
  });
});
