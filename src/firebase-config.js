import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyA4IEgR1F5IV8ZeVtiOoqvbpFgNG1ikSEE",
//   authDomain: "sample-firebase-backend-1e1db.firebaseapp.com",
//   projectId: "sample-firebase-backend-1e1db",
//   storageBucket: "sample-firebase-backend-1e1db.appspot.com",
//   messagingSenderId: "638431877567",
//   appId: "1:638431877567:web:069f073c09eb752df7690a",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDuSxApttgCea0HDnDbIeIOz5lX-JgGUYA",
  authDomain: "learning-portal-4889f.firebaseapp.com",
  projectId: "learning-portal-4889f",
  storageBucket: "learning-portal-4889f.appspot.com",
  messagingSenderId: "643059496922",
  appId: "1:643059496922:web:57fc1aa2d18b4f676772e3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
