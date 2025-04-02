// Data management for the Discord Application Portal
// This file handles storing and retrieving data from JSON files

// In a production environment, this would connect to a database
// For this demo, we'll simulate data storage using localStorage

// Application data structure
const DATA_KEYS = {
  APPLICATIONS: 'app_portal_applications',
  SUBMISSIONS: 'app_portal_submissions',
  SETTINGS: 'app_portal_settings'
};

// Initialize data storage
function initializeDataStorage() {
  if (!localStorage.getItem(DATA_KEYS.APPLICATIONS)) {
    localStorage.setItem(DATA_KEYS.APPLICATIONS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(DATA_KEYS.SUBMISSIONS)) {
    localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(DATA_KEYS.SETTINGS)) {
    localStorage.setItem(DATA_KEYS.SETTINGS, JSON.stringify({
      notificationsEnabled: true,
      theme: 'dark',
      accentColor: '#7289DA'
    }));
  }
}

// Get all applications
function getApplications() {
  const applications = localStorage.getItem(DATA_KEYS.APPLICATIONS);
  return applications ? JSON.parse(applications) : [];
}

// Get application by ID
function getApplicationById(id) {
  const applications = getApplications();
  return applications.find(app => app.id === id);
}

// Save application
function saveApplication(application) {
  const applications = getApplications();
  
  // If application has an ID, update existing
  if (application.id) {
    const index = applications.findIndex(app => app.id === application.id);
    if (index !== -1) {
      applications[index] = application;
    } else {
      applications.push(application);
    }
  } else {
    // New application
    application.id = generateId();
    application.createdAt = new Date().toISOString();
    applications.push(application);
  }
  
  localStorage.setItem(DATA_KEYS.APPLICATIONS, JSON.stringify(applications));
  return application;
}

// Delete application
function deleteApplication(id) {
  let applications = getApplications();
  applications = applications.filter(app => app.id !== id);
  localStorage.setItem(DATA_KEYS.APPLICATIONS, JSON.stringify(applications));
  
  // Also delete related submissions
  let submissions = getSubmissions();
  submissions = submissions.filter(sub => sub.applicationId !== id);
  localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

// Get all submissions
function getSubmissions() {
  const submissions = localStorage.getItem(DATA_KEYS.SUBMISSIONS);
  return submissions ? JSON.parse(submissions) : [];
}

// Get submissions for a specific application
function getSubmissionsByApplicationId(applicationId) {
  const submissions = getSubmissions();
  return submissions.filter(sub => sub.applicationId === applicationId);
}

// Get submission by ID
function getSubmissionById(id) {
  const submissions = getSubmissions();
  return submissions.find(sub => sub.id === id);
}

// Save submission
function saveSubmission(submission) {
  const submissions = getSubmissions();
  
  // If submission has an ID, update existing
  if (submission.id) {
    const index = submissions.findIndex(sub => sub.id === submission.id);
    if (index !== -1) {
      submissions[index] = submission;
    } else {
      submissions.push(submission);
    }
  } else {
    // New submission
    submission.id = generateId();
    submission.createdAt = new Date().toISOString();
    submission.status = 'pending'; // pending, approved, rejected
    submissions.push(submission);
  }
  
  localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  return submission;
}

// Update submission status
function updateSubmissionStatus(id, status) {
  const submissions = getSubmissions();
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index !== -1) {
    submissions[index].status = status;
    submissions[index].updatedAt = new Date().toISOString();
    localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    return submissions[index];
  }
  
  return null;
}

// Delete submission
function deleteSubmission(id) {
  let submissions = getSubmissions();
  submissions = submissions.filter(sub => sub.id !== id);
  localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

// Get settings
function getSettings() {
  const settings = localStorage.getItem(DATA_KEYS.SETTINGS);
  return settings ? JSON.parse(settings) : {
    notificationsEnabled: true,
    theme: 'dark',
    accentColor: '#7289DA'
  };
}

// Save settings
function saveSettings(settings) {
  localStorage.setItem(DATA_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
}

// Export to JSON file
function exportData() {
  const data = {
    applications: getApplications(),
    submissions: getSubmissions(),
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'discord_app_portal_data.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Import from JSON file
function importData(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.applications) {
      localStorage.setItem(DATA_KEYS.APPLICATIONS, JSON.stringify(data.applications));
    }
    
    if (data.submissions) {
      localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(data.submissions));
    }
    
    if (data.settings) {
      localStorage.setItem(DATA_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Initialize data storage on load
initializeDataStorage();

// Sample data for testing
function loadSampleData() {
  // Only load sample data if no applications exist
  if (getApplications().length === 0) {
    const sampleApplications = [
      {
        id: 'app1',
        title: 'Staff Application',
        description: 'Apply to join our server staff team',
        category: 'staff',
        visibility: 'server',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        fields: [
          {
            id: 'field1',
            type: 'text',
            label: 'What is your name?',
            placeholder: 'Enter your name',
            required: true
          },
          {
            id: 'field2',
            type: 'textarea',
            label: 'Why do you want to join our team?',
            placeholder: 'Enter your response',
            required: true
          },
          {
            id: 'field3',
            type: 'select',
            label: 'How much experience do you have?',
            options: ['None', 'Less than 1 year', '1-2 years', '3+ years'],
            required: true
          }
        ],
        design: {
          theme: 'dark',
          accentColor: '#7289DA',
          bgStyle: 'stars'
        },
        settings: {
          webhookUrl: '',
          storeSubmissions: true,
          emailNotifications: false
        }
      },
      {
        id: 'app2',
        title: 'Partnership Request',
        description: 'Request a partnership with our server',
        category: 'partnership',
        visibility: 'public',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        fields: [
          {
            id: 'field1',
            type: 'text',
            label: 'Server Name',
            placeholder: 'Enter your server name',
            required: true
          },
          {
            id: 'field2',
            type: 'text',
            label: 'Server Invite Link',
            placeholder: 'Enter your server invite link',
            required: true
          },
          {
            id: 'field3',
            type: 'number',
            label: 'Member Count',
            placeholder: 'Enter your server member count',
            required: true
          },
          {
            id: 'field4',
            type: 'textarea',
            label: 'Why should we partner with you?',
            placeholder: 'Enter your response',
            required: true
          }
        ],
        design: {
          theme: 'neon',
          accentColor: '#FF00CC',
          bgStyle: 'gradient'
        },
        settings: {
          webhookUrl: '',
          storeSubmissions: true,
          emailNotifications: true
        }
      }
    ];
    
    const sampleSubmissions = [
      {
        id: 'sub1',
        applicationId: 'app1',
        userId: '123456789012345678',
        username: 'DiscordUser#1234',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        responses: {
          field1: 'John Doe',
          field2: 'I have been a member of this community for over a year and would love to help it grow further. I have previous moderation experience and am very active.',
          field3: '1-2 years'
        }
      },
      {
        id: 'sub2',
        applicationId: 'app1',
        userId: '234567890123456789',
        username: 'GamerPro#5678',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'rejected',
        responses: {
          field1: 'Jane Smith',
          field2: 'I want to be a mod because it would be cool to have power.',
          field3: 'None'
        }
      },
      {
        id: 'sub3',
        applicationId: 'app1',
        userId: '345678901234567890',
        username: 'ServerHelper#9012',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        responses: {
          field1: 'Alex Johnson',
          field2: 'I am online daily and want to help maintain a positive community environment. I have moderated several large Discord servers before.',
          field3: '3+ years'
        }
      },
      {
        id: 'sub4',
        applicationId: 'app2',
        userId: '456789012345678901',
        username: 'ServerOwner#3456',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        responses: {
          field1: 'Gaming Community',
          field2: 'https://discord.gg/example',
          field3: '5000',
          field4: 'Our server has a similar audience and we could benefit from cross-promotion. We have an active community with regular events.'
        }
      }
    ];
    
    localStorage.setItem(DATA_KEYS.APPLICATIONS, JSON.stringify(sampleApplications));
    localStorage.setItem(DATA_KEYS.SUBMISSIONS, JSON.stringify(sampleSubmissions));
  }
}

// Load sample data for demo purposes
loadSampleData();

// Export functions for use in other scripts
window.dataManager = {
  getApplications,
  getApplicationById,
  saveApplication,
  deleteApplication,
  getSubmissions,
  getSubmissionsByApplicationId,
  getSubmissionById,
  saveSubmission,
  updateSubmissionStatus,
  deleteSubmission,
  getSettings,
  saveSettings,
  exportData,
  importData
};