// Dashboard JavaScript for the Discord Application Portal
// This file handles functionality for the dashboard page

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!window.auth || !window.auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }
  
  // Load dashboard data
  loadDashboardData();
  
  // Set up event listeners
  setupEventListeners();
});

// Load dashboard data
function loadDashboardData() {
  // Get applications and submissions from data manager
  const applications = window.dataManager.getApplications();
  const submissions = window.dataManager.getSubmissions();
  
  // Update stats
  updateStats(applications, submissions);
  
  // Load recent applications
  loadRecentApplications(applications);
  
  // Load recent submissions
  loadRecentSubmissions(submissions);
}

// Update dashboard stats
function updateStats(applications, submissions) {
  // Update total applications count
  const totalAppsElement = document.getElementById('total-apps');
  if (totalAppsElement) {
    totalAppsElement.textContent = applications.length;
  }
  
  // Update total submissions count
  const totalSubmissionsElement = document.getElementById('total-submissions');
  if (totalSubmissionsElement) {
    totalSubmissionsElement.textContent = submissions.length;
  }
  
  // Count approved submissions
  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;
  const approvedCountElement = document.getElementById('approved-count');
  if (approvedCountElement) {
    approvedCountElement.textContent = approvedCount;
  }
  
  // Count rejected submissions
  const rejectedCount = submissions.filter(sub => sub.status === 'rejected').length;
  const rejectedCountElement = document.getElementById('rejected-count');
  if (rejectedCountElement) {
    rejectedCountElement.textContent = rejectedCount;
  }
}

// Load recent applications
function loadRecentApplications(applications) {
  const recentAppsList = document.getElementById('recent-apps-list');
  if (!recentAppsList) return;
  
  // Sort applications by creation date (newest first)
  const sortedApps = [...applications].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Take only the 3 most recent
  const recentApps = sortedApps.slice(0, 3);
  
  if (recentApps.length === 0) {
    recentAppsList.innerHTML = `
      <div class="empty-state">
        <p>No applications created yet</p>
        <a href="create-application.html" class="btn-primary">
          <i class="fas fa-plus-circle"></i> Create Your First Application
        </a>
      </div>
    `;
    return;
  }
  
  // Generate HTML for each application
  recentAppsList.innerHTML = recentApps.map(app => {
    const submissionCount = window.dataManager.getSubmissionsByApplicationId(app.id).length;
    const createdDate = new Date(app.createdAt).toLocaleDateString();
    
    return `
      <div class="application-item">
        <div class="application-icon">
          <i class="fas ${getCategoryIcon(app.category)}"></i>
        </div>
        <div class="application-info">
          <h3>${app.title}</h3>
          <p>${app.description}</p>
          <div class="application-meta">
            <span><i class="fas fa-calendar-alt"></i> Created: ${createdDate}</span>
            <span><i class="fas fa-clipboard-list"></i> Submissions: ${submissionCount}</span>
          </div>
        </div>
        <div class="application-actions">
          <a href="edit-application.html?id=${app.id}" class="btn-icon">
            <i class="fas fa-edit"></i>
          </a>
          <a href="view-submissions.html?id=${app.id}" class="btn-icon">
            <i class="fas fa-eye"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Load recent submissions
function loadRecentSubmissions(submissions) {
  const recentSubmissionsList = document.getElementById('recent-submissions-list');
  if (!recentSubmissionsList) return;
  
  // Sort submissions by creation date (newest first)
  const sortedSubmissions = [...submissions].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Take only the 5 most recent
  const recentSubmissions = sortedSubmissions.slice(0, 5);
  
  if (recentSubmissions.length === 0) {
    recentSubmissionsList.innerHTML = `
      <div class="empty-state">
        <p>No submissions received yet</p>
      </div>
    `;
    return;
  }
  
  // Generate HTML for each submission
  recentSubmissionsList.innerHTML = recentSubmissions.map(submission => {
    const app = window.dataManager.getApplicationById(submission.applicationId);
    const submittedDate = new Date(submission.createdAt).toLocaleDateString();
    const statusClass = getStatusClass(submission.status);
    
    return `
      <div class="submission-item">
        <div class="submission-status ${statusClass}">
          <i class="fas ${getStatusIcon(submission.status)}"></i>
        </div>
        <div class="submission-info">
          <h3>${app ? app.title : 'Unknown Application'}</h3>
          <p>Submitted by: ${submission.username}</p>
          <div class="submission-meta">
            <span><i class="fas fa-calendar-alt"></i> ${submittedDate}</span>
            <span class="submission-status-text ${statusClass}">
              ${capitalizeFirstLetter(submission.status)}
            </span>
          </div>
        </div>
        <div class="submission-actions">
          <a href="view-submission.html?id=${submission.id}" class="btn-icon">
            <i class="fas fa-eye"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Set up event listeners
function setupEventListeners() {
  // Add any dashboard-specific event listeners here
}

// Helper functions
function getCategoryIcon(category) {
  switch (category) {
    case 'staff':
      return 'fa-user-tie';
    case 'partnership':
      return 'fa-handshake';
    case 'support':
      return 'fa-headset';
    default:
      return 'fa-clipboard-list';
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'approved':
      return 'status-success';
    case 'rejected':
      return 'status-danger';
    default:
      return 'status-pending';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'approved':
      return 'fa-check-circle';
    case 'rejected':
      return 'fa-times-circle';
    default:
      return 'fa-clock';
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}