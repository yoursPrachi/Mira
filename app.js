import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyCXxwXHnQop2RuEs-7W1DCQ8-35iGClWik",
  authDomain: "mira-chatbot-9e51a.firebaseapp.com",
  projectId: "mira-chatbot-9e51a",
  storageBucket: "mira-chatbot-9e51a.appspot.com",
  messagingSenderId: "856415616380",
  appId: "1:856415616380:web:320ac30e32f711eeb8b8f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 UI */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

/* 🔹 Auto Focus */
window.onload = () => input.focus();

/* 🔹 User Memory */
let uid = localStorage.getItem("uid");
if (!uid) {
  uid = crypto.randomUUID();
  localStorage.setItem("uid", uid);
}

/* 🔹 Helpers */
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function similarity(a, b) {
  a = a.toLowerCase().split(" ");
  b = b.toLowerCase().split(" ");
  let m = 0;
  a.forEach(w => b.includes(w) && m++);
  return m / Math.max(a.length, b.length);
}

/* 🔹 Learning */
async function getReply(text) {
  const snap = await getDocs(collection(db, "users", uid, "memory"));
  let best = null, score = 0;

  snap.forEach(d => {
    const s = similarity(text, d.data().userText);
    if (s > score) {
      score = s;
      best = d.data().botReply;
    }
  });

  return score > 0.4 ? best : "Hmm 😊 tell me more";
}

async function save(text, reply) {
  await addDoc(collection(db, "users", uid, "memory"), {
    userText: text,
    botReply: reply,
    time: Date.now()
  });
}

/* 🔹 Chat Flow */
async function chat(text) {
  addMessage("user", text);
  input.value = "";
  status.textContent = "typing…";

  addMessage("bot", "...");
  const typing = chatBox.lastChild;

  const reply = await getReply(text);

  setTimeout(() => {
    typing.remove();
    addMessage("bot", reply);
    save(text, reply);
    status.textContent = "online";
  }, 900 + Math.random() * 1200);
}

/* 🔹 Send Logic */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  chat(text);
}

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* 🔹 Typing Status */
let t;
input.addEventListener("input", () => {
  status.textContent = "typing…";
  clearTimeout(t);
  t = setTimeout(() => status.textContent = "online", 700);
});
