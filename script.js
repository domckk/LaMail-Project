document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.5
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

 // ==============================================
    // DOM ELEMENTS REFERENCES
    // ==============================================
    const authView = document.getElementById('auth-view');        // Signup form container
    const loginView = document.getElementById('login-view');      // Login form container
    const successMessage = document.getElementById('success-message'); // Success message popup
    const loginLink = document.getElementById('login-link');      // "Log in" link
    const signupLink = document.getElementById('signup-link');    // "Sign up" link
    const signupForm = document.getElementById('signup-form');    // Signup form
    const loginForm = document.getElementById('login-form');      // Login form

    // ==============================================
    // DATA STORAGE (USING LOCALSTORAGE AS A SIMPLE DATABASE)
    // ==============================================
    // Load users from localStorage or initialize empty array
    let users = JSON.parse(localStorage.getItem('LaMail_users')) || [];
    // Load emails from localStorage or initialize empty array
    let emails = JSON.parse(localStorage.getItem('LaMail_emails')) || [];
    // Track currently logged in user
    let currentUser = null;

    // ==============================================
    // EVENT LISTENERS FOR AUTHENTICATION
    // ==============================================
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        authView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        authView.classList.remove('hidden');
    });

    signupForm.addEventListener('submit', handleSignup);
    loginForm.addEventListener('submit', handleLogin);

    // ==============================================
    // AUTHENTICATION FUNCTIONS
    // ==============================================
function handleSignup(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!name || !email || !password) {
        shakeForm(signupForm);
        return;
    }
    
    // Validate email format
    if (!validateEmail(email)) {
        shakeForm(signupForm);
        alert('Please enter a valid email address');
        return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('This email is already registered. Please log in.');
        authView.classList.add('hidden');
        loginView.classList.remove('hidden');
        return;
    }
    
    // Show loading state
    const btn = signupForm.querySelector('.submit-btn');
    btn.innerHTML = '<span>Processing...</span>';
    btn.disabled = true;
    
    // Simulate server request with timeout
    setTimeout(() => {
        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password // Note: In production, never store plain text passwords
        };
        
        // Add user to database
        users.push(newUser);
        localStorage.setItem('LaMail_users', JSON.stringify(users));
        
        // Send welcome email
        const welcomeEmail = {
            id: Date.now().toString(),
            from: 'LaMail@gmail.com',
            to: email,
            subject: 'Welcome to LaMail\'s Community!',
            body: `Hi ${name},\n\nThank you for joining our community!`,
            date: new Date().toISOString(),
            folder: 'inbox',
            read: false
        };
        
        // Add email to database
        emails.push(welcomeEmail);
        localStorage.setItem('LaMail_emails', JSON.stringify(emails));
        
        // Show success message
        showSuccessMessage(email);
        
        // Reset form and show login page instead of going to inbox
        signupForm.reset();
        btn.innerHTML = '<span>Join Community</span><i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        
        authView.classList.add('hidden');
        loginView.classList.remove('hidden');
        
    }, 1500);
}

    function handleLogin(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Validate inputs
        if (!email || !password) {
            shakeForm(loginForm);
            return;
        }
        
        // Show loading state
        const btn = loginForm.querySelector('.submit-btn');
        btn.innerHTML = '<span>Logging in...</span>';
        btn.disabled = true;
        
        // Simulate server request with timeout
        setTimeout(() => {
            // Find user in database
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Successful login
                currentUser = user;
                createInboxModal();
                showSuccessMessage(email);
            } else {
                // Failed login
                btn.innerHTML = '<span>Log In</span><i class="fas fa-sign-in-alt"></i>';
                btn.disabled = false;
                alert('Invalid email or password');
            }
        }, 1000);
    }

    // ==============================================
    // INBOX SYSTEM FUNCTIONS
    // ==============================================
function createInboxModal() {
    // Hide auth views
    authView.classList.add('hidden');
    loginView.classList.add('hidden');
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'inbox-overlay';
    document.body.appendChild(overlay);
    
    // Create inbox container with complete structure
    const inboxContainer = document.createElement('div');
    inboxContainer.className = 'inbox-container';
    inboxContainer.id = 'inbox-view';
    
    // Add the full inbox HTML including compose form
    inboxContainer.innerHTML = `
        <div class="inbox-sidebar">
            <div class="inbox-header">
                <div class="user-profile">
                    <span id="current-user-email">${currentUser.name}</span>
                    <span id="current-user-email">${currentUser.email}</span>
                </div>
                <button id="compose-btn" class="compose-btn">
                    <i class="fas fa-plus"></i> Compose
                </button>
            </div>
            
            <div class="inbox-folders">
                <div class="folder active" data-folder="inbox">
                    <i class="fas fa-inbox"></i> Inbox <span id="inbox-count" class="badge">0</span>
                </div>
                <div class="folder" data-folder="sent">
                    <i class="fas fa-paper-plane"></i> Sent
                </div>
                <div class="folder" data-folder="trash">
                    <i class="fas fa-trash"></i> Trash
                </div>
            </div>
            
            <button id="logout-btn" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
        
        <div class="inbox-content">
            <div class="email-list" id="email-list">
                <!-- Emails will appear here -->
            </div>
            
            <div class="email-view hidden" id="email-view">
                <div class="email-header">
                    <h2 id="email-subject"></h2>
                    <div class="email-meta">
                        <div id="email-from"></div>
                        <div id="email-date"></div>
                    </div>
                </div>
                <div class="email-body" id="email-body"></div>
                <div class="email-actions">
                    <button id="reply-btn" class="action-btn">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button id="forward-btn" class="action-btn">
                        <i class="fas fa-share"></i> Forward
                    </button>
                    <button id="delete-btn" class="action-btn delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            
            <!-- COMPOSE EMAIL FORM -->
            <div class="compose-email hidden" id="compose-view">
                <div class="compose-header">
                    <h3>New Message</h3>
                    <button id="close-compose" class="close-btn">&times;</button>
                </div>
                <form id="compose-form">
                    <div class="input-group">
                        <label for="compose-to">To:</label>
                        <input type="email" id="compose-to" required>
                    </div>
                    <div class="input-group">
                        <label for="compose-subject">Subject:</label>
                        <input type="text" id="compose-subject" required>
                    </div>
                    <div class="input-group">
                        <label for="compose-body">Message:</label>
                        <textarea id="compose-body" rows="10" required></textarea>
                    </div>
                    <div class="compose-actions">
                        <button type="submit" class="submit-btn">
                            <span>Send</span>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                        <button type="button" id="save-draft" class="draft-btn">
                            <i class="fas fa-save"></i> Save Draft
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(inboxContainer);
    
    // Set up event listeners
    setupInboxEvents();
    
    // Load initial emails
    loadEmails('inbox');
}


function setupInboxEvents() {
    const inboxView = document.getElementById('inbox-view');
    const overlay = document.getElementById('inbox-overlay');
    
    // Logout button
    const logoutBtn = inboxView.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Compose button
    const composeBtn = inboxView.querySelector('#compose-btn');
    composeBtn.addEventListener('click', showComposeView);
    
    // Close compose button
    const closeComposeBtn = inboxView.querySelector('#close-compose');
    closeComposeBtn.addEventListener('click', hideComposeView);
    
    // Compose form submission
    const composeForm = inboxView.querySelector('#compose-form');
    composeForm.addEventListener('submit', sendEmail);
    
    // Folder navigation
    const folders = inboxView.querySelectorAll('.folder');
    folders.forEach(folder => {
        folder.addEventListener('click', () => loadEmails(folder.dataset.folder));
    });
    
    // Close modal when clicking outside
    overlay.addEventListener('click', handleLogout);
}

    function loadEmails(folder) {
        const inboxView = document.getElementById('inbox-view');
        if (!inboxView) return;
        
        // Update active folder UI
        const folders = inboxView.querySelectorAll('.folder');
        folders.forEach(f => f.classList.remove('active'));
        inboxView.querySelector(`.folder[data-folder="${folder}"]`).classList.add('active');
        
        // Filter emails based on folder and current user
        let filteredEmails = emails.filter(email => {
            if (folder === 'inbox') {
                // Show received emails in inbox
                return email.to === currentUser.email && email.folder === 'inbox';
            } else if (folder === 'sent') {
                // Show sent emails
                return email.from === currentUser.email && email.folder === 'sent';
            } else {
                // For trash, show both sent and received emails marked as trash
                return (email.to === currentUser.email || email.from === currentUser.email) && 
                       email.folder === folder;
            }
        });
        
        // Sort by date (newest first)
        filteredEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Get references to email list and detail view
        const emailList = inboxView.querySelector('#email-list');
        const emailView = inboxView.querySelector('#email-view');
        
        // Clear current list
        emailList.innerHTML = '';
        emailView.classList.add('hidden');
        
        // Show message if no emails
        if (filteredEmails.length === 0) {
            emailList.innerHTML = '<div class="no-emails">No emails in this folder</div>';
            return;
        }
        
        // Create email list items
        filteredEmails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = `email-item ${email.read ? '' : 'unread'}`;
            emailItem.dataset.id = email.id;
            
            // Format sender/recipient based on folder
            const sender = folder === 'sent' ? `To: ${email.to}` : `From: ${email.from}`;
            const date = new Date(email.date).toLocaleString();
            
            // Email list item HTML
            emailItem.innerHTML = `
                <div class="email-sender">
                    <span>${sender}</span>
                    <span>${date}</span>
                </div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.body.substring(0, 100)}...</div>
            `;
            
            // Click handler to view email
            emailItem.addEventListener('click', () => viewEmail(email.id));
            emailList.appendChild(emailItem);
        });
    }

function viewEmail(id) {
    const inboxView = document.getElementById('inbox-view');
    if (!inboxView) return;
    
    // Find the email in database
    const email = emails.find(e => e.id === id);
    if (!email) return;
    
    // Mark as read if it's in inbox
    if (email.folder === 'inbox' && !email.read) {
        email.read = true;
        localStorage.setItem('LaMail_emails', JSON.stringify(emails));
        updateUnreadCount();
        
        // Update UI to show email as read
        const emailItem = inboxView.querySelector(`.email-item[data-id="${id}"]`);
        if (emailItem) emailItem.classList.remove('unread');
    }
    
    // Display email details
    inboxView.querySelector('#email-subject').textContent = email.subject;
    inboxView.querySelector('#email-from').textContent = `From: ${email.from}`;
    inboxView.querySelector('#email-date').textContent = new Date(email.date).toLocaleString();
    inboxView.querySelector('#email-body').textContent = email.body;
    
    // Get current folder
    const currentFolder = inboxView.querySelector('.folder.active').dataset.folder;
    
    // Setup reply button (only available for inbox emails)
    const replyBtn = inboxView.querySelector('#reply-btn');
    if (currentFolder === 'inbox') {
        replyBtn.style.display = 'block';
        replyBtn.onclick = () => {
            showComposeView();
            inboxView.querySelector('#compose-to').value = email.from;
            inboxView.querySelector('#compose-subject').value = `Re: ${email.subject}`;
            inboxView.querySelector('#compose-body').value = 
                `\n\n-------- Original Message --------\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\n\n${email.body}`;
        };
    } else {
        replyBtn.style.display = 'none';
    }
    
    // Setup forward button
    inboxView.querySelector('#forward-btn').onclick = () => {
        showComposeView();
        inboxView.querySelector('#compose-subject').value = `Fwd: ${email.subject}`;
        inboxView.querySelector('#compose-body').value = 
            `-------- Forwarded Message --------\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\n\n${email.body}`;
    };
    
    // Setup delete button
    const deleteBtn = inboxView.querySelector('#delete-btn');
    if (currentFolder === 'trash') {
        // In trash folder, permanently delete the email
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Permanently Delete';
        deleteBtn.onclick = () => {
            if (confirm('Are you sure you want to permanently delete this email?')) {
                // Remove email from array
                emails = emails.filter(e => e.id !== id);
                localStorage.setItem('LaMail_emails', JSON.stringify(emails));
                
                // Reload the trash folder
                loadEmails('trash');
                inboxView.querySelector('#email-view').classList.add('hidden');
            }
        };
    } else {
        // In other folders, move to trash
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Move to Trash';
        deleteBtn.onclick = () => {
            email.folder = 'trash';
            localStorage.setItem('LaMail_emails', JSON.stringify(emails));
            loadEmails(currentFolder);
            inboxView.querySelector('#email-view').classList.add('hidden');
        };
    }
    
    // Show email detail view
    inboxView.querySelector('#email-view').classList.remove('hidden');
}

    // ==============================================
    // EMAIL COMPOSITION FUNCTIONS
    // ==============================================
    function showComposeView() {
        const inboxView = document.getElementById('inbox-view');
        if (!inboxView) return;
        
        // Show compose form and clear any previous values
        const composeView = inboxView.querySelector('#compose-view');
        composeView.classList.remove('hidden');
        composeView.querySelector('#compose-to').value = '';
        composeView.querySelector('#compose-subject').value = '';
        composeView.querySelector('#compose-body').value = '';
    }

    function hideComposeView() {
        const inboxView = document.getElementById('inbox-view');
        if (!inboxView) return;
        
        // Hide compose form
        inboxView.querySelector('#compose-view').classList.add('hidden');
    }

    function sendEmail(e) {
        e.preventDefault();
        
        const inboxView = document.getElementById('inbox-view');
        if (!inboxView) return;
        
        // Get form values
        const to = inboxView.querySelector('#compose-to').value;
        const subject = inboxView.querySelector('#compose-subject').value;
        const body = inboxView.querySelector('#compose-body').value;
        
        // Validate inputs
        if (!to || !subject || !body) {
            alert('Please fill in all fields');
            return;
        }
        
        // Validate email format
        if (!validateEmail(to)) {
            alert('Please enter a valid recipient email');
            return;
        }
        
        // Check if recipient exists (except for system emails)
        const recipient = users.find(user => user.email === to);
        if (!recipient && to !== 'LaMail@gmail.com') {
            if (!confirm('The recipient is not registered. Send anyway?')) {
                return;
            }
        }
        
        // Create new email object
        const newEmail = {
            id: Date.now().toString(),
            from: currentUser.email,
            to,
            subject,
            body,
            date: new Date().toISOString(),
            folder: 'sent', // This is the sender's copy
            read: true
        };
        
        // Add to sender's sent folder
        emails.push(newEmail);
        
        // If recipient exists, create a copy for their inbox
        if (recipient || to === 'LaMail@gmail.com') {
            const inboxEmail = {
                ...newEmail,
                folder: 'inbox', // This is the recipient's copy
                read: false
            };
            emails.push(inboxEmail);
        }
        
        // Save to database
        localStorage.setItem('LaMail_emails', JSON.stringify(emails));
        
        // Show success and reload UI
        alert('Email sent successfully!');
        hideComposeView();
        loadEmails('sent');
    }

    // ==============================================
    // UTILITY FUNCTIONS
    // ==============================================
    function handleLogout() {
        // Remove inbox modal and overlay
        const inboxView = document.getElementById('inbox-view');
        const overlay = document.getElementById('inbox-overlay');
        if (inboxView) inboxView.remove();
        if (overlay) overlay.remove();
        
        // Reset authentication state
        currentUser = null;
        authView.classList.remove('hidden');
        signupForm.reset();
        loginForm.reset();
        
        // Reset buttons to initial state
        const signupBtn = signupForm.querySelector('.submit-btn');
        signupBtn.innerHTML = '<span>Join Community</span><i class="fas fa-paper-plane"></i>';
        signupBtn.disabled = false;
        
        const loginBtn = loginForm.querySelector('.submit-btn');
        loginBtn.innerHTML = '<span>Log In</span><i class="fas fa-sign-in-alt"></i>';
        loginBtn.disabled = false;
    }

    function updateUnreadCount() {
        const inboxView = document.getElementById('inbox-view');
        if (!inboxView) return;
        
        // Count unread emails in inbox
        const unreadCount = emails.filter(
            email => email.to === currentUser.email && 
                    email.folder === 'inbox' && 
                    !email.read
        ).length;
        
        // Update badge display
        const badge = inboxView.querySelector('#inbox-count');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

function showSuccessMessage(email) {
    document.getElementById('subscribed-email').textContent = email;
    
    // Make sure the message is on top of everything
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.zIndex = '1000';
    
    // Show the message
    successMessage.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 4000);
}

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function shakeForm(form) {
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            top: -10px;
            opacity: 0;
            animation: confetti 3s ease-in-out infinite;
        }
        .no-emails {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    `;
    document.head.appendChild(style);
});