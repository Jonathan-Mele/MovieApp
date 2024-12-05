//Functionality for the login for. Sends user input to login route and saves an authentication token to carry user data throughout

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 
  
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value; 
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('userId', data._id);
        alert('Login successful!');
        window.location.href = 'movies.html'; // Redirect to home page
      } else {
        document.getElementById('errorMessage').innerText =
          data.message || 'Invalid email or password. Please try again.';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
    }
  });
  