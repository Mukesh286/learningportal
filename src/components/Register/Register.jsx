import React, { useState } from "react";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userInfo = {
        role: isStudent ? "student" : "college",
        collegeName,
        address,
        zipcode,
        mobileNumber,
        firstName: isStudent ? firstName : "",
        lastName: isStudent ? lastName : "",
        email,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userInfo);

      console.log("User registered:", user, userInfo);
      navigate("/login");
    } catch (error) {
      setError("Error registering: " + error.message);
    }
  };

  return (
    <div className="reg-body">
      <div class="reg-wrapper">
        <div class="reg-flip-card__inner">
          <div class="reg-flip-card__front">
            <div class="reg-title">Register</div>
            <div class="reg-flip-card__form">
              <div className="reg-radio-input">
                <label className="reg-label">
                  <input
                    type="radio"
                    id="reg-value-1"
                    checked={isStudent}
                    onChange={() => setIsStudent(true)}
                    name="reg-value-radio"
                    value="value-1"
                    className="reg-radio"
                  />
                  <p className="reg-text">Student</p>
                </label>
                <label className="reg-label">
                  <input
                    type="radio"
                    id="reg-value-2"
                    checked={!isStudent}
                    onChange={() => setIsStudent(false)}
                    name="reg-value-radio"
                    value="value-2"
                    className="reg-radio"
                  />
                  <p className="reg-text">College</p>
                </label>
              </div>
            </div>

            {isStudent && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  class="reg-flip-card__input"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  class="reg-flip-card__input"
                  required
                />
              </>
            )}

            <input
              type="text"
              placeholder="College Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              class="reg-flip-card__input"
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleRegister} class="reg-flip-card__btn">
              Register
            </button>
            <button
              class="reg-flip-card__btn"
              onClick={() => navigate("/login")}
              style={{ marginTop: "10px" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
