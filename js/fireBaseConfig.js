// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTQoHdqgyqqerRjZmYJ0ReLmuLRnu2jMs",
  authDomain: "cadastro-dos-agendamentos.firebaseapp.com",
  databaseURL: "https://cadastro-dos-agendamentos-default-rtdb.firebaseio.com",
  projectId: "cadastro-dos-agendamentos",
  storageBucket: "cadastro-dos-agendamentos.firebasestorage.app",
  messagingSenderId: "562865018681",
  appId: "1:562865018681:web:25359c5b8beb2bd9bf7ae8",
  measurementId: "G-ZF0CGPBPLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, app };
