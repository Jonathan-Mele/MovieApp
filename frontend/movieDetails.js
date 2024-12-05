/*
Logic for the movie details page
Logic for the comments and deleting comments
Logic for the ratings
*/

document.addEventListener('DOMContentLoaded', async () => {
  const movieDetailsContainer = document.getElementById('movieDetails');
  const commentsContainer = document.getElementById('commentsContainer');
  const commentFormContainer = document.getElementById('commentFormContainer');
  const ratingFormContainer = document.getElementById('ratingFormContainer');
  const homeBtn = document.getElementById('homeBtn');

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');

  if (!movieId) {
    movieDetailsContainer.innerHTML = `<p>Movie not found. Please try again.</p>`;
    return;
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = 'movies.html'; 
    });
  }

  // Fetch and display movie details
  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movie details.');
      }

      const movie = await response.json();

      movieDetailsContainer.innerHTML = `
        <div class="movie-details">
          <img class="movie-poster" src="${movie.poster || 'https://via.placeholder.com/300'}" alt="${movie.title}">
          <div class="movie-info">
            <h2>${movie.title}</h2>
            <p><strong>Plot:</strong> ${movie.fullplot || movie.plot || 'No plot available'}</p>
            <p><strong>Genres:</strong> ${movie.genres ? movie.genres.join(', ') : 'N/A'}</p>
            <p><strong>Release Date:</strong> ${movie.released ? new Date(movie.released).toDateString() : 'N/A'}</p>
            <p id="movieRating"><strong>Rating:</strong> Loading...</p>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      movieDetailsContainer.innerHTML = `<p>Failed to load movie details. Please try again later.</p>`;
    }
  };

  // Fetch and display the average rating
  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/ratings/average/${movieId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch average rating.');
      }

      const { averageRating, ratingsCount } = await response.json();
      const ratingElement = document.getElementById('movieRating');

      if (ratingsCount > 0) {
        ratingElement.innerHTML = `<p><strong>Average Rating:</strong> ${averageRating} / 5 (${ratingsCount} ratings)</p>`;
      } else {
        ratingElement.innerHTML = `<p><strong>Rating:</strong> None</p>`;
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
      const ratingElement = document.getElementById('movieRating');
      ratingElement.innerHTML = `<p><strong>Rating:</strong> Not available</p>`;
    }
  };

  // Render the rating form
  const renderRatingForm = () => {
    if (!ratingFormContainer) {
      console.error('Rating form container not found in the DOM.');
      return;
    }

    ratingFormContainer.innerHTML = `
      <h3>Rate this Movie</h3>
      <form id="ratingForm">
        <label for="ratingSelect">Choose a rating:</label>
        <select id="ratingSelect" required>
          <option value="" disabled selected>Select a rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button type="submit">Submit Rating</button>
      </form>
    `;

    const ratingForm = document.getElementById('ratingForm');
    if (ratingForm) {
      ratingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const rating = document.getElementById('ratingSelect').value;

        if (!rating) {
          alert('Please select a rating.');
          return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/ratings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ movieId, rating }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to submit rating.');
          }

          alert('Rating submitted successfully!');
          fetchAverageRating(); // Refresh the displayed average rating after a new one is added (or old one is updated)
        } catch (error) {
          console.error('Error submitting rating:', error);
          alert('Failed to submit rating. Please try again.');
        }
      });
    } else {
      console.error('Rating form not found.');
    }
  };

  // Fetch and display comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments?movieId=${movieId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments.');
      }

      const comments = await response.json();

      commentsContainer.innerHTML = `
        <h3>Comments</h3>
        <ul class="comments-list">
          ${comments
            .map(
              (comment) => `
              <li class="comment-item">
                <p><strong>${comment.user?.name || 'Anonymous'}</strong>: ${comment.text}</p>
                <p class="comment-date">${new Date(comment.createdAt).toLocaleString()}</p>
                ${
                  comment.user?._id === localStorage.getItem('userId') // Check if the logged-in user owns the comment. if so display a delete button
                    ? `<button class="delete-comment-btn" data-id="${comment._id}">Delete</button>`
                    : ''
                }
              </li>
            `
            )
            .join('')}
        </ul>
      `;

      addDeleteCommentListeners();
    } catch (error) {
      console.error('Error fetching comments:', error);
      commentsContainer.innerHTML = `<p>Failed to load comments. Please try again later.</p>`;
    }
  };

  // Add event listeners for deleting comments
  const addDeleteCommentListeners = () => {
    const deleteButtons = document.querySelectorAll('.delete-comment-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const commentId = event.target.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this comment?')) {
          try {
            const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to delete comment.');
            }

            alert('Comment deleted successfully!');
            fetchComments(); // Reload comments after deletion to show change
          } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
          }
        }
      });
    });
  };

  // Render the comment form
  const renderCommentForm = () => {
    commentFormContainer.innerHTML = `
      <h3>Leave a Comment</h3>
      <form id="commentForm">
        <textarea id="commentText" placeholder="Write your comment here..." required></textarea>
        <button type="submit">Submit</button>
      </form>
    `;

    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const commentText = document.getElementById('commentText').value;

      if (!commentText) {
        alert('Please enter a comment.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ text: commentText, movieId }),
        });

        if (!response.ok) {
          throw new Error('Failed to post comment.');
        }

        document.getElementById('commentText').value = '';
        alert('Comment posted successfully!');
        fetchComments();
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    });
  };

  await fetchMovieDetails();
  await fetchAverageRating();
  await fetchComments();
  renderCommentForm();
  renderRatingForm();
});
