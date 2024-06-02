// Chat functionality
const chatWindow = document.getElementById('chat-window');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const logoutButton = document.getElementById('logout-btn');

// Initialize Firebase services
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Function to add messages to the chat window
function addMessageToChatWindow(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${messageData.sender}: ${messageData.message}`;
    chatWindow.appendChild(messageDiv);
}

// Function to load chat messages
function loadChatMessages() {
    db.collection('messages').orderBy('timestamp')
        .onSnapshot(snapshot => {
            chatWindow.innerHTML = ''; // Clear chat window
            snapshot.forEach(doc => {
                addMessageToChatWindow(doc.data());
            });
        });
}

// Send message event listener
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    if (messageText) {
        db.collection('messages').add({
            sender: auth.currentUser.email,
            message: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = '';
    }
});

// Logout event listener
logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    }).catch(error => {
        console.error('Error signing out: ', error);
    });
});

// Monitor auth state and load chat messages
auth.onAuthStateChanged(user => {
    if (user) {
        loadChatMessages();
    } else {
        window.location.href = 'login.html';
    }
});

// Fot login.html
document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'chat.html';
        })
        .catch(error => {
            console.error('Error logging in: ', error);
        });
});

// For signup.html
document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'chat.html';
        })
        .catch(error => {
            console.error('Error signing up: ', error);
        });
});
