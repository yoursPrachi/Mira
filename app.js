const chatBox = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// In-memory message storage (client-side only)
let messages = [];

// Random fallback replies if no match
const fallbackReplies = [
  "Hi! 😄 How can I help you?",
  "That's interesting! Tell me more.",
  "Oh wow! Can you explain a bit?",
  "I see! How does that make you feel?",
  "Cool! What happened next?"
];

// Display message in chat UI
function displayMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.src = "file_000000000e9071fbb771d0d4ff3686da.png";
    msg.appendChild(avatar);
  }
  const span = document.createElement("span");
  span.textContent = text;
  msg.appendChild(span);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple similarity function
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
