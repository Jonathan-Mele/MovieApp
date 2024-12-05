//Sign up page

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
  
    const name = document.getElementById('name').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 
  
    try {
      // Send a request to the backend signup route
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userId', data._id);
        alert('Sign up successful! Redirecting to the movies page...');
        window.location.href = 'movies.html'; // Redirect to home page
      } else {
        document.getElementById('errorMessage').innerText =
          data.message || 'Sign up failed. Please try again.';
      }
    } catch (error) {
      console.error('Error signing up:', error);
      document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
    }
  });
  