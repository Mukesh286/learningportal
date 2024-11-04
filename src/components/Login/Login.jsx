import React, { useState } from "react";
import { auth } from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      localStorage.setItem("uid", user.uid);
      const role = await fetchUserRole(user.uid);

      if (role === "student") {
        navigate("/home");
      } else if (role === "college") {
        navigate("/home/college");
      } else {
        setError("User role not found.");
      }
    } catch (error) {
      setError("Error logging in: " + error.message);
    }
  };

  const fetchUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      return null;
    }
  };

  return (
    <div className="login-body">
      <div class="login-wrapper">
        <div class="login-flip-card__inner">
          <div class="login-flip-card__front">
            <div class="login-title">Log in</div>
            <div class="login-flip-card__form">
              <input
                type="email"
                placeholder="Email"
                class="login-flip-card__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                class="login-flip-card__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button onClick={handleLogin} class="login-flip-card__btn">
                Login
              </button>
              <button
                class="login-flip-card__btn"
                onClick={() => navigate("/register")}
                style={{ marginTop: "10px" }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
