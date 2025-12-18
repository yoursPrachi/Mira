import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const chatBox = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const countryLangMap = { in: "hi", us: "en", fr: "fr", de: "de" }; // Extend as needed

// Display messages
function displayMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.src = "assets/mira-avatar.png";
    msg.appendChild(avatar);
  }

  const span = document.createElement("span");
  span.textContent = text;
  msg.appendChild(span);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Save conversation
async function saveConversation(userMessage, botMessage) {
  await addDoc(collection(db, "messages"), {
    user: userMessage,
    bot: botMessage,
    timestamp: new Date()
  });
}

// Basic similarity function
function similarity(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  const words1 = str1.split(" ");
  const words2 = str2.split(" ");
  let matches = 0;
  words1.forEach((w) => {
    if (words2.includes(w)) matches++;
  });
  return matches / Math.max(words1.length, words2.length);
}

// Intelligent bot reply
async function getBotReply(userInput) {
  const snapshot = await getDocs(collection(db, "messages"));
  let bestMatch = null;
  let highestScore = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const score = similarity(userInput, data.user);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = data.bot;
    }
  });

  return highestScore > 0.5 ? bestMatch : "I am learning. Can you tell me more?";
}

// Translation using LibreTranslate
async function translateText(text, targetLang) {
  const response = await fetch("https://libretranslate.com/translate", {
    method: "POST",
    body: JSON.stringify({ q: text, source: "en", target: targetLang, format: "text" }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await response.json();
  return data.translatedText;
}

// Get user location
async function getUserLanguage() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      // Simple fallback: assume India if not detected
      resolve("hi"); // You can integrate OpenCage/Google API here
    }, () => resolve("en"));
  });
}

// Handle chat
async function chat(userMessage) {
  displayMessage("user", userMessage);

  const userLang = await getUserLanguage();
  let botReply = await getBotReply(userMessage);
  botReply = await translateText(botReply, userLang);

  // Typing delay
  displayMessage("bot", "Mira is typing...");
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  chatBox.lastChild.remove(); // remove typing
  displayMessage("bot", botReply);

  await saveConversation(userMessage, botReply);
}

// Send button
sendBtn.addEventListener("click", () => {
  const msg = input.value.trim();
  if (!msg) return;
  chat(msg);
  input.value = "";
});

// Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
