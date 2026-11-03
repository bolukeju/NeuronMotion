const questions = [
  {
    question: "Bagian sistem saraf yang menjadi pusat koordinasi dan pemrosesan informasi adalah …",
    answers: ["Saraf tepi", "Otak", "Otot", "Sendi"],
    correct: 1,
    explanation: "Otak berperan sebagai pusat koordinasi dan pemrosesan informasi."
  },
  {
    question: "Bagian yang menghubungkan sistem saraf pusat dengan seluruh organ tubuh adalah …",
    answers: ["Tulang", "Sumsum tulang belakang saja", "Saraf tepi", "Tendon"],
    correct: 2,
    explanation: "Saraf tepi menghubungkan otak dan sumsum tulang belakang dengan bagian tubuh lainnya."
  },
  {
    question: "Alat gerak aktif yang bekerja melalui kontraksi dan relaksasi adalah …",
    answers: ["Tulang", "Sendi", "Otot", "Saraf"],
    correct: 2,
    explanation: "Otot merupakan alat gerak aktif karena dapat berkontraksi dan relaksasi."
  },
  {
    question: "Manakah yang termasuk fungsi tulang?",
    answers: ["Mengolah semua informasi sensorik", "Menopang tubuh dan melindungi organ vital", "Mengirim impuls ke otak", "Menghasilkan gerak refleks secara langsung"],
    correct: 1,
    explanation: "Tulang menopang postur tubuh dan melindungi organ penting seperti otak dan jantung."
  },
  {
    question: "Gerak refleks umumnya diproses cepat melalui …",
    answers: ["Sumsum tulang belakang", "Saraf tepi saja", "Sendi", "Otot tanpa sistem saraf"],
    correct: 0,
    explanation: "Pada banyak gerak refleks, sumsum tulang belakang menjadi pusat pemrosesan awal sehingga respons dapat berlangsung cepat."
  }
];

const startScreen = document.getElementById("quizStart");
const quizContent = document.getElementById("quizContent");
const resultScreen = document.getElementById("quizResult");
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextQuestion");
const progressFill = document.getElementById("progressFill");
const questionCount = document.getElementById("questionCount");
const scoreLabel = document.getElementById("scoreLabel");

let currentQuestion = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizContent.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const item = questions[currentQuestion];
  questionCount.textContent = `PERTANYAAN ${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length}`;
  scoreLabel.textContent = `SKOR: ${score}`;
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answerList.innerHTML = "";
  feedback.className = "feedback hidden";
  nextButton.classList.add("hidden");
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? 'Lihat Hasil <span>→</span>'
    : 'Soal Berikutnya <span>→</span>';

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answerList.appendChild(button);
  });
}

function chooseAnswer(selectedIndex, selectedButton) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answerList.querySelectorAll("button")];
  buttons.forEach(button => button.disabled = true);

  if (selectedIndex === item.correct) {
    score++;
    selectedButton.classList.add("correct");
    feedback.textContent = `Benar! ${item.explanation}`;
    feedback.className = "feedback correct-feedback";
  } else {
    selectedButton.classList.add("wrong");
    buttons[item.correct].classList.add("correct");
    feedback.textContent = `Belum tepat. ${item.explanation}`;
    feedback.className = "feedback wrong-feedback";
  }

  scoreLabel.textContent = `SKOR: ${score}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  nextButton.classList.remove("hidden");
}

function showResult() {
  quizContent.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  const title = document.getElementById("resultTitle");
  const message = document.getElementById("resultMessage");
  const icon = document.getElementById("resultIcon");

  if (score === questions.length) {
    title.textContent = "Sempurna! Kamu hebat.";
    message.textContent = "Semua jawaban benar. Kamu sudah memahami materi dengan sangat baik!";
    icon.textContent = "✦";
  } else if (score >= 3) {
    title.textContent = "Bagus, terus tingkatkan!";
    message.textContent = "Pemahamanmu sudah cukup baik. Baca kembali materi yang masih belum kamu kuasai.";
    icon.textContent = "✧";
  } else {
    title.textContent = "Jangan menyerah!";
    message.textContent = "Yuk, pelajari lagi ringkasan materi lalu coba kuis sekali lagi.";
    icon.textContent = "↗";
  }
}

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("retryQuiz").addEventListener("click", startQuiz);
nextButton.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("#beranda, #materi, #kuis");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => observer.observe(section));
