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
      <div className="login-wrapper">
        <div className="login-flip-card__inner">
          <div className="login-flip-card__front">
            <h1 className="visually-hidden">Login to Your Account</h1>
            <div className="login-title">Log in</div>
            <div className="login-flip-card__form">
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="login-flip-card__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password" className="visually-hidden">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="login-flip-card__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button onClick={handleLogin} className="login-flip-card__btn">
                Login
              </button>
              <button
                className="login-flip-card__btn"
                onClick={() => navigate("/register")}
                style={{ marginTop: "10px" }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      <noscript>
        <p>
          To use this application, JavaScript must be enabled in your browser.
        </p>
      </noscript>
    </div>
  );
};

export default Login;
