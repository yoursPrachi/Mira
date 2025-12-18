import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXxwXHnQop2RuEs-7W1DCQ8-35iGClWik",
  authDomain: "mira-chatbot-9e51a.firebaseapp.com",
  projectId: "mira-chatbot-9e51a",
  storageBucket: "mira-chatbot-9e51a.appspot.com",
  messagingSenderId: "856415616380",
  appId: "1:856415616380:web:320ac30e32f711eeb8b8f9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
      }
