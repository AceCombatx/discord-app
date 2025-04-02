// Discord OAuth Configuration
const CLIENT_ID = '1234567890123456789'; // Replace with your Discord application client ID
const REDIRECT_URI = 'http://fi10.bot-hosting.net:20053/callback';
const API_ENDPOINT = 'https://discord.com/api/v10';

// User state
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('discord_token');
  if (token) {
    fetchUserDetails(token);
  } else {
    // If on dashboard or protected page, redirect to login
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('create-application') ||
        window.location.pathname.includes('applications') ||
        window.location.pathname.includes('submissions')) {
      window.location.href = 'index.html';
    }
  }

  // Set up login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', initiateLogin);
  }

  // Set up logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Handle sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('active');
    });
  }

  // Check if this is the callback page
  if (window.location.search.includes('code=')) {
    handleAuthCallback();
  }
});

// Initiate Discord OAuth login
function initiateLogin() {
  const scope = 'identify email guilds';
  const state = generateRandomState();
  
  localStorage.setItem('oauth_state', state);
  
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${scope}&state=${state}`;
  
  window.location.href = authUrl;
}

// Handle the OAuth callback
async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = localStorage.getItem('oauth_state');
  
  if (!code) {
    showError('Authorization code not received from Discord');
    return;
  }
  
  if (state !== storedState) {
    showError('State validation failed. Possible CSRF attack.');
    return;
  }
  
  try {
    // In a real application, you would exchange the code for a token on your backend
    // For this demo, we'll simulate a successful token exchange
    const token = 'simulated_token_' + Math.random().toString(36).substring(2);
    localStorage.setItem('discord_token', token);
    
    // Fetch user details with the token
    await fetchUserDetails(token);
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    showError('Failed to complete authentication: ' + error.message);
  }
}

// Fetch user details from Discord API
async function fetchUserDetails(token) {
  try {
    // In a real application, you would make an actual API call
    // For this demo, we'll simulate a successful API response
    currentUser = {
      id: '123456789012345678',
      username: 'DiscordUser',
      discriminator: '1234',
      avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abcdef1234567890.png',
      email: 'user@example.com',
      guilds: [
        {
          id: '987654321098765432',
          name: 'My Cool Server',
          icon: 'abcdef1234567890',
          owner: true,
          permissions: 8
        },
        {
          id: '876543210987654321',
          name: 'Gaming Community',
          icon: '0987654321abcdef',
          owner: false,
          permissions: 0
        }
      ]
    };
    
    updateUIWithUserInfo();
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    logout();
  }
}

// Update UI elements with user information
function updateUIWithUserInfo() {
  if (!currentUser) return;
  
  // Update avatar
  const avatarElements = document.querySelectorAll('#user-avatar');
  avatarElements.forEach(el => {
    if (el) el.src = currentUser.avatar;
  });
  
  // Update username
  const usernameElements = document.querySelectorAll('#username');
  usernameElements.forEach(el => {
    if (el) el.textContent = currentUser.username;
  });
  
  // Update discriminator/tag
  const tagElements = document.querySelectorAll('#user-tag');
  tagElements.forEach(el => {
    if (el) el.textContent = `#${currentUser.discriminator}`;
  });
  
  // Update welcome message
  const welcomeNameElement = document.getElementById('welcome-name');
  if (welcomeNameElement) {
    welcomeNameElement.textContent = currentUser.username;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('discord_token');
  localStorage.removeItem('oauth_state');
  currentUser = null;
  window.location.href = 'index.html';
}

// Generate a random state string for CSRF protection
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Show error message
function showError(message) {
  console.error(message);
  // In a real application, you would show a user-friendly error message
  alert('Authentication Error: ' + message);
}

// Export functions and user state for use in other scripts
window.auth = {
  currentUser,
  initiateLogin,
  logout,
  isLoggedIn: () => !!currentUser
};