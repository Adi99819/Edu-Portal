const courses=[
  {
    id:1,
    title:"Web Development Fundamentals",
    cat:"Web",
    difficulty:"Beginner",
    img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    videoThumb:"https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
    desc:"Master HTML, CSS & JavaScript from scratch. Build responsive websites.",
    progress:40,
    duration:"12 hours",
    lessons:24
  },
  {
    id:2,
    title:"AI & Machine Learning Basics",
    cat:"AI",
    difficulty:"Beginner",
    img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    videoThumb:"https://img.youtube.com/vi/z-EtmaFjxBE/0.jpg",
    desc:"Introduction to Artificial Intelligence, ML algorithms, neural networks.",
    progress:60,
    duration:"15 hours",
    lessons:30
  }
];

// Question banks for quizzes
const questions = {
  1: [ // Web Dev
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HyperTransfer Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      answer: 0
    },
    {
      question: "Which HTML tag is used for the largest heading?",
      options: ["<h1>", "<h6>", "<h3>", "<heading>"],
      answer: 0
    },
    {
      question: "What is the correct HTML for making a hyperlink?",
      options: ["<a ref='link'>", "<a>link</a>", "<href>link</href>", "<link>"],
      answer: 1
    },
    {
      question: "Which CSS property controls text size?",
      options: ["font-size", "text-style", "text-size", "font-style"],
      answer: 0
    },
    {
      question: "What does CSS stand for?",
      options: ["Creative Style Sheets", "Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
      answer: 2
    },
    {
      question: "How do you select an element with id 'demo' in CSS?",
      options: [".demo", "#demo", "demo", "element demo"],
      answer: 1
    }
  ],
  2: [ // AI Basics
    {
      question: "What does AI stand for?",
      options: ["Artificial Intelligence", "Auto Intelligence", "Algorithmic Intelligence", "Advanced Integration"],
      answer: 0
    },
    {
      question: "Which of these is a type of machine learning?",
      options: ["Supervised", "Unsupervised", "Reinforcement", "All of the above"],
      answer: 3
    },
    {
      question: "What is 'overfitting' in machine learning?",
      options: ["Model too simple", "Model performs poorly on training data", "Model performs well on training but poor on new data", "Model ignores training data"],
      answer: 2
    },
    {
      question: "Which algorithm is used for classification?",
      options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"],
      answer: 1
    },
    {
      question: "What does 'neural network' consist of?",
      options: ["Neurons connected in layers", "Random data points", "Simple if-else rules", "Database tables"],
      answer: 0
    },
    {
      question: "Who is known as the father of AI?",
      options: ["Alan Turing", "John McCarthy", "Elon Musk", "Bill Gates"],
      answer: 1
    }
  ]
};

function getEnrolled() {
  return JSON.parse(localStorage.getItem("enrolled") || "[]");
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function render() {
  let search = document.getElementById("search").value.toLowerCase();
  let cat = document.getElementById("category").value;
  let difficulty = document.getElementById("difficulty") ? document.getElementById("difficulty").value : 'All';
  let html = "";
  courses.filter(c => 
    c.title.toLowerCase().includes(search) && 
    (cat == "All" || c.cat == cat) &&
    (difficulty == "All" || c.difficulty == difficulty)
  ).forEach(c => {
    let isFav = getFavorites().includes(c.id);
    let star = isFav ? '★' : '☆';
    html += `<div class='card' data-id="${c.id}">
      <img src='${c.img}'>
      <div class='card-content'>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>${c.title}</h3>
          <button onclick="toggleFavorite(${c.id})" class="fav-btn">${star}</button>
        </div>
        <span class="difficulty-badge">${c.difficulty}</span>
        <p class="course-desc">${c.desc.substring(0,80)}...</p>
        <div class='progress'><div style='width:${c.progress}%'></div></div>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
          <button onclick="showDetails(${c.id})" class="details-btn">Details</button>
          <button onclick="quiz(${c.id})">Start Quiz</button>
        </div>
      </div>
    </div>`;
  });
  document.getElementById("courses").innerHTML = html;
  renderDashboard();
}

function toggleFavorite(id) {
  let f = getFavorites();
  let idx = f.indexOf(id);
  if (idx > -1) {
    f.splice(idx,1);
  } else {
    f.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(f));
  render();
}

function enrollCourse(id) {
  let enrolled = getEnrolled();
  if (!enrolled.includes(id)) {
    enrolled.push(id);
    localStorage.setItem("enrolled", JSON.stringify(enrolled));
  }
  renderDashboard();
}

function showDetails(id) {
  let c = courses.find(course => course.id === id);
  if (c) {
    document.getElementById('modal-body').innerHTML = `
      <div class="modal-video">
        <img src="${c.videoThumb}" alt="Video Preview">
        <div class="play-icon">▶</div>
      </div>
      <h2>${c.title}</h2>
      <p class="course-difficulty">${c.difficulty} • ${c.duration} • ${c.lessons} lessons</p>
      <p>${c.desc}</p>
      <div class="progress"><div style="width:${c.progress}%"></div></div>
      <div class="modal-actions">
        <button onclick="enrollCourse(${c.id})" class="enroll-btn">Enroll Now</button>
        <button onclick="quiz(${c.id})" class="quiz-btn">Start Quiz</button>
      </div>
    `;
    document.getElementById('courseModal').style.display = 'flex';
  }
}

function closeModal() {
  document.getElementById('courseModal').style.display = 'none';
}

function renderDashboard() {
  let enrolled = getEnrolled();
  let favorites = getFavorites();
  let html = '';
  if (enrolled.length === 0 && favorites.length === 0) {
    html = '<p>No enrolled courses or favorites yet. Enroll now!</p>';
  } else {
    if (enrolled.length > 0) {
      html += '<h3>Enrolled Courses</h3><div class="dashboard-grid">';
      enrolled.forEach(id => {
        let c = courses.find(course => course.id === id);
        if (c) {
          html += `<div class="dash-card">
            <h4>${c.title}</h4>
            <div class="progress"><div style="width:${c.progress}%"></div></div>
            <p>${c.progress}% Complete</p>
            <button onclick="showDetails(${c.id})">Continue</button>
          </div>`;
        }
      });
      html += '</div>';
    }
    if (favorites.length > 0) {
      html += '<h3>Favorites</h3><div class="dashboard-grid">';
      favorites.forEach(id => {
        let c = courses.find(course => course.id === id);
        if (c) {
          html += `<div class="dash-card">
            <h4>${c.title}</h4>
            <img src="${c.img}" style="width:60px;height:40px;border-radius:8px">
            <button onclick="showDetails(${c.id})">View Details</button>
          </div>`;
        }
      });
      html += '</div>';
    }
  }
  document.getElementById("dashboard").innerHTML = html;
}

let quizState = null;

function quiz(id) {
  if (!questions[id]) {
    alert('No questions for this course');
    return;
  }
  // Smooth scroll to quiz section
  const quizPanel = document.querySelector('#quiz').closest('.panel');
  if (quizPanel) {
    quizPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  quizState = {
    id,
    questions: questions[id].slice().sort(() => Math.random() - 0.5),
    currentIndex: 0,
    score: 0,
    answers: new Array(questions[id].length).fill(null)
  };
  renderQuestion();
}

function renderQuestion() {
  if (!quizState) return;
  let q = quizState.questions[quizState.currentIndex];
  let html = `
    <div class="quiz-header">
      <h3>Question ${quizState.currentIndex + 1} of ${quizState.questions.length}</h3>
    </div>
    <p class="question-text">${q.question}</p>
    <div class="options">
      ${q.options.map((opt, i) => `
        <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${quizState.currentIndex}-${i}">
          ${String.fromCharCode(65 + i)}. ${opt}
        </button>
      `).join('')}
    </div>
    <div class="quiz-controls">
      <button onclick="prevQuestion()" ${quizState.currentIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''}>Previous</button>
      <button onclick="nextQuestion()">Next</button>
      <button onclick="submitQuiz()">Finish Quiz</button>
    </div>
  `;
  document.getElementById("quiz").innerHTML = html;
  
  // Reset and restore option states
  setTimeout(() => {
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected', 'correct', 'wrong');
    });
    const prevAnswer = quizState.answers[quizState.currentIndex];
    if (prevAnswer !== null) {
      const prevBtn = document.getElementById(`opt-${quizState.currentIndex}-${prevAnswer}`);
      if (prevBtn) {
        prevBtn.classList.add('selected');
      }
    }
  }, 0);
}

function selectAnswer(i) {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected', 'correct', 'wrong');
  });
  let btn = document.getElementById('opt-' + quizState.currentIndex + '-' + i);
  if (btn) {
    btn.classList.add('selected');
  }
  quizState.answers[quizState.currentIndex] = i;
}

function nextQuestion() {
  let currQ = quizState.questions[quizState.currentIndex];
  let userAns = quizState.answers[quizState.currentIndex];
  let selectedBtn = document.querySelector('.selected');
  if (userAns !== null) {
    if (userAns === currQ.answer) {
      quizState.score += 1;
      if (selectedBtn) {
        selectedBtn.classList.add('correct');
        selectedBtn.classList.remove('selected');
      }
    } else {
      if (selectedBtn) {
        selectedBtn.classList.add('wrong');
        selectedBtn.classList.remove('selected');
      }
      // Show correct one
      let correctBtn = document.getElementById('opt-' + quizState.currentIndex + '-' + currQ.answer);
      if (correctBtn) {
        correctBtn.classList.add('correct');
      }
    }
  }
  // Delay next for feedback
  setTimeout(() => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      quizState.currentIndex++;
      renderQuestion();
    } else {
      submitQuiz();
    }
  }, 1500);
}

function prevQuestion() {
  if (quizState.currentIndex > 0) {
    quizState.currentIndex--;
    renderQuestion();
  }
}

function submitQuiz() {
  let finalScore = Math.round((quizState.score / quizState.questions.length) * 100);
  let data = JSON.parse(localStorage.getItem("scores") || "[]");
  data.push(finalScore);
  localStorage.setItem("scores", JSON.stringify(data));
  leaderboard();
  document.getElementById("quiz").innerHTML = `<h2>Quiz Complete!</h2><p>Your score: ${finalScore}% (${quizState.score}/${quizState.questions.length})</p><button onclick="location.reload()">Start New Quiz</button>`;
}

function submit(ans) {
  submitQuiz();
}

function leaderboard() {
  let data = JSON.parse(localStorage.getItem("scores") || "[]");
  let html = "";
  data.sort((a, b) => b - a).slice(0, 10).forEach(s => html += `<li>${s}%</li>`);
  document.getElementById("leaderboard").innerHTML = html;
}

function toggleDark() { document.body.classList.toggle("light"); }
function submitFeedback() {
  let email = document.getElementById("email").value.trim();
  let msg = document.getElementById("msg").value.trim();
  let emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter valid email");
    return;
  }
  if (msg.length < 10) {
    alert("Message too short (min 10 chars)");
    return;
  }
  alert("Feedback submitted successfully!");
  document.getElementById("email").value = '';
  document.getElementById("msg").value = '';
}

function toggleNotifications() {
  let panel = document.getElementById('notificationsPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

const notifications = [
  "New Quiz Added for AI Basics!",
  "Web Dev course updated with new lessons.",
  "Welcome to EduPortal! Check out courses.",
  "High score on leaderboard - great job!"
];

function renderNotifications() {
  let html = '';
  notifications.forEach((notif, i) => {
    html += `<div class="notif-item">${notif}</div>`;
  });
  document.getElementById('notif-list').innerHTML = html;
}

// Authentication functions
function initAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('userWelcome').textContent = `Hi, ${userData.username}!`;
    document.getElementById('userWelcome').style.display = 'inline';
  }
}

function toggleAuthModal(mode = 'login') {
  const modal = document.getElementById('authModal');
  modal.style.display = 'flex';
  switchToLogin();
  if (mode === 'register') {
    switchToRegister();
  }
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function switchToLogin() {
  document.getElementById('authTitle').textContent = 'Login';
  document.getElementById('authEmail').style.display = 'none';
  document.getElementById('authUsername').placeholder = 'Username';
  document.getElementById('authSubmit').textContent = 'Login';
  document.getElementById('authToggle').style.display = 'block';
  document.getElementById('registerToggle').style.display = 'none';
}

function switchToRegister() {
  document.getElementById('authTitle').textContent = 'Register';
  document.getElementById('authEmail').style.display = 'block';
  document.getElementById('authUsername').placeholder = 'Username';
  document.getElementById('authSubmit').textContent = 'Register';
  document.getElementById('authToggle').style.display = 'none';
  document.getElementById('registerToggle').style.display = 'block';
}

document.getElementById('authForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('authUsername').value.trim();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  
  const isRegister = document.getElementById('authTitle').textContent === 'Register';
  
  if (isRegister) {
    // Register
    const user = { username, email, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful!');
  } else {
    // Login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.username === username && userData.password === password) {
        alert('Login successful!');
      } else {
        alert('Invalid credentials!');
        return;
      }
    } else {
      alert('No account found. Please register first.');
      return;
    }
  }
  
  closeAuthModal();
  initAuth();
});

renderNotifications();
initAuth();
render(); 
leaderboard();
