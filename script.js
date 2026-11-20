const questions = [
  {
    question: "Bagian otak yang bertugas mengoordinasikan gerak otot serta menjaga keseimbangan dan postur adalah …",
    answers: ["Otak besar (cerebrum)", "Otak kecil (cerebellum)", "Sumsum tulang belakang", "Neuron asosiasi"],
    correct: 1,
    explanation: "Otak kecil mengoordinasikan gerak otot, postur, dan keseimbangan. Otak besar lebih berperan pada berpikir, ingatan, dan gerak sadar."
  },
  {
    question: "Urutan jalur gerak refleks yang benar adalah …",
    answers: [
      "Rangsang → reseptor → neuron sensorik → otak → neuron motorik → otot",
      "Rangsang → otot → neuron motorik → sumsum tulang belakang → reseptor",
      "Rangsang → reseptor → neuron sensorik → sumsum tulang belakang → neuron motorik → otot",
      "Rangsang → neuron motorik → otak → neuron sensorik → reseptor → otot"
    ],
    correct: 2,
    explanation: "Pada refleks, impuls diolah di sumsum tulang belakang sehingga respons terjadi sebelum otak menyadarinya. Pilihan pertama adalah jalur gerak sadar."
  },
  {
    question: "Neuron yang membawa impuls dari reseptor menuju pusat saraf disebut neuron …",
    answers: ["Sensorik", "Motorik", "Asosiasi", "Efektor"],
    correct: 0,
    explanation: "Neuron sensorik menghantarkan impuls dari reseptor ke otak atau sumsum tulang belakang. Neuron motorik membawanya dari pusat saraf ke efektor."
  },
  {
    question: "Sendi bahu dan sendi panggul termasuk jenis sendi …",
    answers: ["Engsel", "Putar", "Pelana", "Peluru"],
    correct: 3,
    explanation: "Sendi peluru memungkinkan gerak ke segala arah. Siku dan lutut adalah contoh sendi engsel yang hanya bergerak pada satu bidang."
  },
  {
    question: "Ketika lengan menekuk di siku, apa yang terjadi pada otot lengan atas?",
    answers: [
      "Biceps dan triceps sama-sama berkontraksi",
      "Biceps berkontraksi, triceps rileks",
      "Triceps berkontraksi, biceps rileks",
      "Biceps dan triceps sama-sama rileks"
    ],
    correct: 1,
    explanation: "Biceps (fleksor) memendek dan menarik lengan bawah, sedangkan triceps (ekstensor) rileks. Keduanya adalah otot antagonis."
  }
];

/* ---------- Elemen umum ---------- */
const views = {
  beranda: document.getElementById("view-beranda"),
  materi: document.getElementById("view-materi"),
  kuis: document.getElementById("view-kuis")
};
const topicEls = [...document.querySelectorAll(".topic")];
const topics = topicEls.map((el, i) => ({
  id: el.dataset.id,
  title: el.dataset.title,
  group: el.dataset.group,
  el,
  index: i
}));
const stageBody = document.getElementById("stageBody");
const navLinks = document.querySelectorAll("[data-nav]");
const pad = n => String(n).padStart(2, "0");

/* ---------- Bangun daftar isi (beranda) dan rel (materi) dari artikel ---------- */
(function buildIndexes() {
  const rail = document.getElementById("railList");
  const groups = [...new Set(topics.map(t => t.group))];
  groups.forEach(name => {
    const wrap = document.createElement("div");
    wrap.className = "rail-group";
    wrap.dataset.group = name;
    wrap.innerHTML = `<h4>${name}</h4>`;
    topics.filter(t => t.group === name).forEach(t => {
      const a = document.createElement("a");
      a.href = `#materi/${t.id}`;
      a.dataset.topic = t.id;
      a.innerHTML = `<span class="n">${pad(t.index + 1)}</span><span>${t.title}</span>`;
      wrap.appendChild(a);
    });
    rail.appendChild(wrap);
  });

  topics.forEach(t => {
    const c = t.el.querySelector(".topic-count");
    if (c) c.textContent = `${pad(t.index + 1)} / ${pad(topics.length)}`;
  });
})();

/* ---------- Gambar gagal dimuat ---------- */
document.addEventListener("error", event => {
  const img = event.target;
  if (img && img.tagName === "IMG") {
    const plate = img.closest(".plate");
    if (plate) plate.classList.add("broken");
  }
}, true);

/* ---------- Router ---------- */
const prevLink = document.getElementById("prevLink");
const nextLink = document.getElementById("nextLink");
const prevTitle = document.getElementById("prevTitle");
const nextTitle = document.getElementById("nextTitle");
const stageCount = document.getElementById("stageCount");
const baseTitle = "Sistem Saraf dan Gerak pada Manusia — Neuron Motion";
let firstRoute = true;

function parseHash() {
  const [view, sub] = location.hash.replace(/^#/, "").split("/");
  const name = views[view] ? view : "beranda";
  return { name, sub };
}

function showTopic(id) {
  const current = topics.find(t => t.id === id) || topics[0];

  topics.forEach(t => t.el.classList.toggle("is-active", t === current));
  document.querySelectorAll(".rail a").forEach(a => {
    if (a.dataset.topic === current.id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });

  const prev = topics[current.index - 1];
  const next = topics[current.index + 1];

  if (prev) {
    prevLink.href = `#materi/${prev.id}`;
    prevTitle.textContent = prev.title;
  } else {
    prevLink.href = "#beranda";
    prevTitle.textContent = "Beranda";
  }
  if (next) {
    nextLink.href = `#materi/${next.id}`;
    nextTitle.textContent = next.title;
  } else {
    nextLink.href = "#kuis";
    nextTitle.textContent = "Kuis";
  }
  stageCount.textContent = `${pad(current.index + 1)} / ${pad(topics.length)}`;

  stageBody.scrollTop = 0;
  const activeLink = document.querySelector('.rail a[aria-current="true"]');
  if (activeLink) activeLink.scrollIntoView({ block: "nearest", inline: "center" });

  document.title = `${current.title} — Neuron Motion`;
  if (!firstRoute) current.el.focus({ preventScroll: true });
}

function route() {
  const { name, sub } = parseHash();

  Object.entries(views).forEach(([key, el]) => el.classList.toggle("is-active", key === name));
  navLinks.forEach(a => {
    if (a.dataset.nav === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  if (name === "materi") {
    showTopic(sub);
  } else {
    document.title = name === "kuis" ? "Kuis — Neuron Motion" : baseTitle;
    views[name].scrollTop = 0;
  }
  firstRoute = false;
}

window.addEventListener("hashchange", route);

document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (parseHash().name !== "materi") return;
  if (/^(input|textarea|select)$/i.test(event.target.tagName)) return;
  if (event.key === "ArrowRight") { location.hash = nextLink.getAttribute("href"); }
  if (event.key === "ArrowLeft") { location.hash = prevLink.getAttribute("href"); }
});

/* ---------- Kuis ---------- */
const startScreen = document.getElementById("quizStart");
const liveScreen = document.getElementById("quizLive");
const resultScreen = document.getElementById("quizResult");
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("nextQuestion");
const meterFill = document.getElementById("meterFill");
const questionCount = document.getElementById("questionCount");
const scoreLabel = document.getElementById("scoreLabel");

let current = 0;
let score = 0;
let answered = false;

function startQuiz() {
  current = 0;
  score = 0;
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  liveScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const item = questions[current];
  questionCount.textContent = `Soal ${current + 1} dari ${questions.length}`;
  scoreLabel.textContent = `Skor ${score}`;
  meterFill.style.width = `${(current / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answerList.innerHTML = "";
  feedback.className = "feedback hidden";
  feedback.textContent = "";
  nextButton.classList.add("hidden");
  nextButton.textContent = current === questions.length - 1 ? "Lihat hasil" : "Soal berikutnya";

  item.answers.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = `<span class="k">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.lastChild.textContent = text;
    button.addEventListener("click", () => choose(index, button));
    answerList.appendChild(button);
  });
}

function choose(selected, button) {
  if (answered) return;
  answered = true;
  const item = questions[current];
  const buttons = [...answerList.children];
  buttons.forEach(b => { b.disabled = true; });

  const right = selected === item.correct;
  if (right) score++;

  buttons[item.correct].classList.add("correct");
  if (!right) button.classList.add("wrong");
  buttons.forEach((b, i) => { if (i !== item.correct && i !== selected) b.classList.add("dim"); });

  feedback.className = `feedback ${right ? "ok" : "no"}`;
  feedback.innerHTML = `<b>${right ? "Benar" : "Belum tepat"}</b>`;
  feedback.append(item.explanation);

  scoreLabel.textContent = `Skor ${score}`;
  meterFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  nextButton.classList.remove("hidden");
  nextButton.focus({ preventScroll: false });
}

function showResult() {
  liveScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  const title = document.getElementById("resultTitle");
  const message = document.getElementById("resultMessage");

  if (score === questions.length) {
    title.textContent = "Semua benar.";
    message.textContent = "Kamu sudah menguasai alur dari rangsangan sampai gerakan. Coba jelaskan jalur refleks kepada temanmu tanpa melihat catatan.";
  } else if (score >= 3) {
    title.textContent = "Sudah cukup baik.";
    message.textContent = "Beberapa konsep masih tertukar. Buka kembali materi yang jawabannya meleset, lalu ulangi kuisnya.";
  } else {
    title.textContent = "Perlu satu putaran lagi.";
    message.textContent = "Mulai dari materi Neuron dan Gerak refleks, karena keduanya menjadi dasar bagi bagian lain, lalu coba kuis sekali lagi.";
  }
}

document.getElementById("startQuiz").addEventListener("click", startQuiz);
document.getElementById("retryQuiz").addEventListener("click", startQuiz);
nextButton.addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
});

/* ---------- Mulai ---------- */
route();
