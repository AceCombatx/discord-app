// Create Application JavaScript for the Discord Application Portal
// This file handles functionality for the application creation page

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!window.auth || !window.auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize form preview
  updateFormPreview();
});

// Set up event listeners
function setupEventListeners() {
  // Add field button
  const addFieldBtn = document.getElementById('add-field-btn');
  if (addFieldBtn) {
    addFieldBtn.addEventListener('click', showFieldTypeModal);
  }
  
  // Field type modal close button
  const closeModalBtn = document.querySelector('.close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideFieldTypeModal);
  }
  
  // Field type options
  const fieldTypeOptions = document.querySelectorAll('.field-type-option');
  fieldTypeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const fieldType = option.getAttribute('data-type');
      addNewField(fieldType);
      hideFieldTypeModal();
    });
  });
  
  // Delete field buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.delete-field')) {
      const fieldItem = e.target.closest('.form-field-item');
      if (fieldItem) {
        fieldItem.remove();
        updateFormPreview();
      }
    }
  });
  
  // Edit field buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.edit-field')) {
      const fieldItem = e.target.closest('.form-field-item');
      if (fieldItem) {
        // In a real application, this would open a field editor modal
        alert('Field editing would open here in a real application');
      }
    }
  });
  
  // Theme selector
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      themeOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      option.classList.add('active');
      
      // Update preview
      const theme = option.getAttribute('data-theme');
      updateThemePreview(theme);
    });
  });
  
  // Accent color picker
  const accentColorPicker = document.getElementById('accent-color');
  if (accentColorPicker) {
    accentColorPicker.addEventListener('input', () => {
      const colorHex = document.getElementById('color-hex');
      if (colorHex) {
        colorHex.textContent = accentColorPicker.value;
      }
      
      updateAccentColorPreview(accentColorPicker.value);
    });
  }
  
  // Background style selector
  const bgStyleSelector = document.getElementById('bg-style');
  if (bgStyleSelector) {
    bgStyleSelector.addEventListener('change', () => {
      updateBgStylePreview(bgStyleSelector.value);
    });
  }
  
  // Preview device buttons
  const previewDesktopBtn = document.getElementById('preview-desktop');
  const previewTabletBtn = document.getElementById('preview-tablet');
  const previewMobileBtn = document.getElementById('preview-mobile');
  
  if (previewDesktopBtn) {
    previewDesktopBtn.addEventListener('click', () => {
      setPreviewDevice('desktop');
    });
  }
  
  if (previewTabletBtn) {
    previewTabletBtn.addEventListener('click', () => {
      setPreviewDevice('tablet');
    });
  }
  
  if (previewMobileBtn) {
    previewMobileBtn.addEventListener('click', () => {
      setPreviewDevice('mobile');
    });
  }
  
  // Form input change listeners for live preview
  const appTitle = document.getElementById('app-title');
  if (appTitle) {
    appTitle.addEventListener('input', updateFormPreview);
  }
  
  const appDescription = document.getElementById('app-description');
  if (appDescription) {
    appDescription.addEventListener('input', updateFormPreview);
  }
  
  // Save draft button
  const saveDraftBtn = document.getElementById('save-draft-btn');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', saveDraft);
  }
  
  // Preview button
  const previewBtn = document.getElementById('preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      // In a real application, this would open a full-screen preview
      alert('Full-screen preview would open here in a real application');
    });
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        window.location.href = 'dashboard.html';
      }
    });
  }
  
  // Create application button
  const createAppBtn = document.getElementById('create-app-btn');
  if (createAppBtn) {
    createAppBtn.addEventListener('click', createApplication);
  }
}

// Show field type modal
function showFieldTypeModal() {
  const modal = document.getElementById('field-type-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

// Hide field type modal
function hideFieldTypeModal() {
  const modal = document.getElementById('field-type-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Add new field to the form builder
function addNewField(fieldType) {
  const formFields = document.getElementById('form-fields');
  if (!formFields) return;
  
  let fieldHTML = '';
  const fieldId = 'field_' + Date.now();
  
  switch (fieldType) {
    case 'text':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="text">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-font"></i> Text Field
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Text Field</label>
            <input type="text" placeholder="Enter text" disabled>
          </div>
        </div>
      `;
      break;
    
    case 'textarea':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="textarea">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-paragraph"></i> Text Area
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Text Area</label>
            <textarea placeholder="Enter longer text" disabled></textarea>
          </div>
        </div>
      `;
      break;
    
    case 'number':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="number">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-hashtag"></i> Number
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Number Field</label>
            <input type="number" placeholder="Enter a number" disabled>
          </div>
        </div>
      `;
      break;
    
    case 'select':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="select">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-list"></i> Dropdown
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Dropdown</label>
            <select disabled>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      `;
      break;
    
    case 'checkbox':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="checkbox">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-check-square"></i> Checkboxes
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Checkbox Group</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" disabled>
                <span class="checkbox-custom"></span>
                Option 1
              </label>
            </div>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" disabled>
                <span class="checkbox-custom"></span>
                Option 2
              </label>
            </div>
          </div>
        </div>
      `;
      break;
    
    case 'radio':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="radio">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-dot-circle"></i> Radio Buttons
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Radio Group</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="radio_${fieldId}" disabled>
                <span class="radio-custom"></span>
                Option 1
              </label>
            </div>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="radio_${fieldId}" disabled>
                <span class="radio-custom"></span>
                Option 2
              </label>
            </div>
          </div>
        </div>
      `;
      break;
    
    case 'date':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="date">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-calendar-alt"></i> Date
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New Date Field</label>
            <input type="date" disabled>
          </div>
        </div>
      `;
      break;
    
    case 'file':
      fieldHTML = `
        <div class="form-field-item" data-field-id="${fieldId}" data-field-type="file">
          <div class="field-header">
            <div class="field-type">
              <i class="fas fa-file-upload"></i> File Upload
            </div>
            <div class="field-actions">
              <button class="btn-icon edit-field"><i class="fas fa-edit"></i></button>
              <button class="btn-icon delete-field"><i class="fas fa-trash"></i></button>
              <button class="btn-icon move-field"><i class="fas fa-grip-lines"></i></button>
            </div>
          </div>
          <div class="field-preview">
            <label>New File Upload</label>
            <input type="file" disabled>
          </div>
        </div>
      `;
      break;
  }
  
  // Add the new field to the form
  formFields.insertAdjacentHTML('beforeend', fieldHTML);
  
  // Update the preview
  updateFormPreview();
}

// Update form preview
function updateFormPreview() {
  const previewTitle = document.getElementById('preview-title');
  const previewDescription = document.getElementById('preview-description');
  const previewAppBody = document.querySelector('.preview-app-body');
  
  // Update title
  const appTitle = document.getElementById('app-title');
  if (previewTitle && appTitle) {
    previewTitle.textContent = appTitle.value || 'Application Title';
  }
  
  // Update description
  const appDescription = document.getElementById('app-description');
  if (previewDescription && appDescription) {
    previewDescription.textContent = appDescription.value || 'Application description goes here';
  }
  
  // Update form fields
  if (previewAppBody) {
    previewAppBody.innerHTML = '';
    
    // Get all form fields
    const formFields = document.querySelectorAll('.form-field-item');
    
    formFields.forEach(field => {
      const fieldType = field.getAttribute('data-field-type');
      const fieldLabel = field.querySelector('label').textContent;
      const fieldPlaceholder = field.querySelector('input, textarea, select')?.getAttribute('placeholder') || '';
      
      let previewFieldHTML = '';
      
      switch (fieldType) {
        case 'text':
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <input type="text" placeholder="${fieldPlaceholder}">
            </div>
          `;
          break;
        
        case 'textarea':
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <textarea placeholder="${fieldPlaceholder}"></textarea>
            </div>
          `;
          break;
        
        case 'number':
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <input type="number" placeholder="${fieldPlaceholder}">
            </div>
          `;
          break;
        
        case 'select':
          const options = Array.from(field.querySelectorAll('option')).map(option => {
            return `<option>${option.textContent}</option>`;
          }).join('');
          
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <select>${options}</select>
            </div>
          `;
          break;
        
        case 'checkbox':
          const checkboxes = Array.from(field.querySelectorAll('.checkbox-label')).map(checkbox => {
            const optionText = checkbox.textContent.trim();
            return `
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox">
                  <span class="checkbox-custom"></span>
                  ${optionText}
                </label>
              </div>
            `;
          }).join('');
          
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              ${checkboxes}
            </div>
          `;
          break;
        
        case 'radio':
          const radios = Array.from(field.querySelectorAll('.radio-label')).map(radio => {
            const optionText = radio.textContent.trim();
            return `
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" name="preview_radio_${field.getAttribute('data-field-id')}">
                  <span class="radio-custom"></span>
                  ${optionText}
                </label>
              </div>
            `;
          }).join('');
          
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              ${radios}
            </div>
          `;
          break;
        
        case 'date':
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <input type="date">
            </div>
          `;
          break;
        
        case 'file':
          previewFieldHTML = `
            <div class="preview-form-field">
              <label>${fieldLabel}</label>
              <input type="file">
            </div>
          `;
          break;
      }
      
      previewAppBody.insertAdjacentHTML('beforeend', previewFieldHTML);
    });
  }
}

// Update theme preview
function updateThemePreview(theme) {
  const previewFrame = document.getElementById('application-preview');
  if (!previewFrame) return;
  
  // Remove all theme classes
  previewFrame.classList.remove('theme-dark', 'theme-light', 'theme-neon', 'theme-custom');
  
  // Add selected theme class
  previewFrame.classList.add(`theme-${theme}`);
}

// Update accent color preview
function updateAccentColorPreview(color) {
  const previewFrame = document.getElementById('application-preview');
  if (!previewFrame) return;
  
  // Set accent color as a custom property
  previewFrame.style.setProperty('--accent-color', color);
}

// Update background style preview
function updateBgStylePreview(style) {
  const previewFrame = document.getElementById('application-preview');
  if (!previewFrame) return;
  
  // Remove all bg style classes
  previewFrame.classList.remove('bg-stars', 'bg-gradient', 'bg-solid', 'bg-custom');
  
  // Add selected bg style class
  previewFrame.classList.add(`bg-${style}`);
}

// Set preview device
function setPreviewDevice(device) {
  const previewContainer = document.querySelector('.preview-container');
  if (!previewContainer) return;
  
  // Remove all device classes
  previewContainer.classList.remove('preview-desktop', 'preview-tablet', 'preview-mobile');
  
  // Add selected device class
  previewContainer.classList.add(`preview-${device}`);
}

// Save draft
function saveDraft() {
  // In a real application, this would save the current state to localStorage or a database
  alert('Draft saved successfully!');
}

// Create application
function createApplication() {
  // Get form values
  const title = document.getElementById('app-title').value;
  const description = document.getElementById('app-description').value;
  const category = document.getElementById('app-category').value;
  const visibility = document.getElementById('app-visibility').value;
  
  // Validate form
  if (!title) {
    alert('Please enter an application title');
    return;
  }
  
  // Get fields
  const fields = [];
  const fieldElements = document.querySelectorAll('.form-field-item');
  
  fieldElements.forEach(fieldElement => {
    const fieldId = fieldElement.getAttribute('data-field-id');
    const fieldType = fieldElement.getAttribute('data-field-type');
    const fieldLabel = fieldElement.querySelector('label').textContent;
    const fieldPlaceholder = fieldElement.querySelector('input, textarea, select')?.getAttribute('placeholder') || '';
    
    const field = {
      id: fieldId,
      type: fieldType,
      label: fieldLabel,
      placeholder: fieldPlaceholder,
      required: true // Default to required
    };
    
    // Add options for select, checkbox, and radio fields
    if (fieldType === 'select' || fieldType === 'checkbox' || fieldType === 'radio') {
      field.options = [];
      
      const optionElements = fieldElement.querySelectorAll('option, .checkbox-label, .radio-label');
      optionElements.forEach(optionElement => {
        field.options.push(optionElement.textContent.trim());
      });
    }
    
    fields.push(field);
  });
  
  // Get design options
  const activeTheme = document.querySelector('.theme-option.active').getAttribute('data-theme');
  const accentColor = document.getElementById('accent-color').value;
  const bgStyle = document.getElementById('bg-style').value;
  
  // Get submission settings
  const webhookUrl = document.getElementById('webhook-url').value;
  const storeSubmissions = document.getElementById('store-submissions').checked;
  const emailNotifications = document.getElementById('email-notifications').checked;
  
  // Create application object
  const application = {
    title,
    description,
    category,
    visibility,
    fields,
    design: {
      theme: activeTheme,
      accentColor,
      bgStyle
    },
    settings: {
      webhookUrl,
      storeSubmissions,
      emailNotifications
    }
  };
  
  // Save application
  const savedApplication = window.dataManager.saveApplication(application);
  
  // Show success message
  alert('Application created successfully!');
  
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}