import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔹 Firebase Config */
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

/* 🔹 UI Elements */
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/* 🔹 Default Replies */
const fallbackReplies = [
  "Hmm 😊 tell me more",
  "I am listening 👂",
  "That sounds interesting",
  "Oh really?",
  "Okay 😄"
];

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
  let match = 0;
  a.forEach(w => { if (b.includes(w)) match++; });
  return match / Math.max(a.length, b.length);
}

/* 🔹 Firestore Learn */
async function getLearnedReply(userText) {
  const snap = await getDocs(collection(db, "chats"));
  let best = null, score = 0;

  snap.forEach(doc => {
    const d = doc.data();
    const s = similarity(userText, d.userText);
    if (s > score) {
      score = s;
      best = d.botReply;
    }
  });

  return score > 0.4 ? best : null;
}

async function saveChat(user, bot) {
  await addDoc(collection(db, "chats"), {
    userText: user,
    botReply: bot,
    time: Date.now()
  });
}

/* 🔹 Chat Flow */
async function handleChat(text) {
  addMessage("user", text);
  input.value = "";

  addMessage("bot", "typing...");
  const typingEl = chatBox.lastChild;

  let reply = await getLearnedReply(text);
  if (!reply) {
    reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  }

  setTimeout(() => {
    typingEl.remove();
    addMessage("bot", reply);
    saveChat(text, reply);
  }, 900 + Math.random() * 1200);
}

/* 🔹 Events */
sendBtn.onclick = () => {
  if (input.value.trim()) handleChat(input.value.trim());
};

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendBtn.click();
});  const words1 = str1.split(" ");
  const words2 = str2.split(" ");
  let matches = 0;
  words1.forEach((w) => {
    if (words2.includes(w)) matches++;
  });
  return matches / Math.max(words1.length, words2.length);
}

// Get bot reply
function getBotReply(userInput) {
  let bestMatch = null;
  let highestScore = 0;
  messages.forEach(msg => {
    const score = similarity(userInput, msg.user);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = msg.bot;
    }
  });
  if (highestScore > 0.5) return bestMatch;
  // If no good match, return a random fallback reply
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

// Handle chat
async function chat(userMessage) {
  displayMessage("user", userMessage);

  // Typing delay
  displayMessage("bot", "Mira is typing...");
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  chatBox.lastChild.remove(); // remove typing

  const botReply = getBotReply(userMessage);

  displayMessage("bot", botReply);

  // Save message to in-memory memory
  messages.push({ user: userMessage, bot: botReply });
}

// Event listeners
sendBtn.addEventListener("click", () => {
  const msg = input.value.trim();
  if (!msg) return;
  chat(msg);
  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
