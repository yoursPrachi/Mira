import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

alert("JS Loaded"); // 🔥 agar ye dikha → JS OK

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

document.getElementById("sendBtn").onclick = async () => {
  const text = document.getElementById("userInput").value;
  await addDoc(collection(db, "test"), { text });
  alert("Saved to Firebase");
};
