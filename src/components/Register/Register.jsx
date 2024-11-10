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
      <div className="reg-wrapper">
        <div className="reg-flip-card__inner">
          <div className="reg-flip-card__front">
            <h1 className="visually-hidden">Register for an Account</h1>{" "}
            {/* First level heading */}
            <div className="reg-title">Register</div>
            <div className="reg-flip-card__form">
              <div className="reg-radio-input">
                <ul>
                  <li>
                    <label htmlFor="studentRadio" className="reg-label">
                      <input
                        type="radio"
                        id="studentRadio"
                        checked={isStudent}
                        onChange={() => setIsStudent(true)}
                        name="reg-value-radio"
                        value="value-1"
                        className="reg-radio"
                      />
                      <p className="reg-text">Student</p>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="collegeRadio" className="reg-label">
                      <input
                        type="radio"
                        id="collegeRadio"
                        checked={!isStudent}
                        onChange={() => setIsStudent(false)}
                        name="reg-value-radio"
                        value="value-2"
                        className="reg-radio"
                      />
                      <p className="reg-text">College</p>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            {/* Conditionally render First Name and Last Name for students */}
            {isStudent && (
              <>
                <label htmlFor="firstName" className="visually-hidden">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="reg-flip-card__input"
                  required
                />
                <label htmlFor="lastName" className="visually-hidden">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="reg-flip-card__input"
                  required
                />
              </>
            )}
            {/* College Name */}
            <label htmlFor="collegeName" className="visually-hidden">
              College Name
            </label>
            <input
              type="text"
              id="collegeName"
              placeholder="College Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Address */}
            <label htmlFor="address" className="visually-hidden">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Zip Code */}
            <label htmlFor="zipcode" className="visually-hidden">
              Zip Code
            </label>
            <input
              type="text"
              id="zipcode"
              placeholder="Zip Code"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Mobile Number */}
            <label htmlFor="mobileNumber" className="visually-hidden">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Email */}
            <label htmlFor="email" className="visually-hidden">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Password */}
            <label htmlFor="password" className="visually-hidden">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Confirm Password */}
            <label htmlFor="confirmPassword" className="visually-hidden">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reg-flip-card__input"
              required
            />
            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* Register Button */}
            <button onClick={handleRegister} className="reg-flip-card__btn">
              Register
            </button>
            {/* Login Button */}
            <nav>
              <button
                className="reg-flip-card__btn"
                onClick={() => navigate("/login")}
                style={{ marginTop: "10px" }}
              >
                Login
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Noscript Message */}
      <noscript>
        <p>
          To use this application, JavaScript must be enabled in your browser.
        </p>
      </noscript>
    </div>
  );
};

export default Register;
