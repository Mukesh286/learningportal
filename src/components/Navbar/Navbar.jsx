import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <nav>
        <div className="nb-navbar">
          <h2 className="nb-h2">Learning Portal</h2>
          <ul className="nb-ul">
            {role === "student" && (
              <>
                <li className="nb-li">
                  <Link className="nb-link" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nb-li">
                  <Link className="nb-link" to="/statistics">
                    Statistics
                  </Link>
                </li>
                <li className="nb-li">
                  <Link className="nb-link" to="/myprofile">
                    My Profile
                  </Link>
                </li>
                <li className="nb-li">
                  <div className="logout-btn">
                    <button className="navbar-Btn" onClick={handleSignOut}>
                      <div className="navbar-sign">
                        <svg viewBox="0 0 512 512">
                          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                      </div>
                      <div className="navbar-btn-text">Logout</div>
                    </button>
                  </div>
                </li>
              </>
            )}
            {role === "college" && (
              <>
                <li className="nb-li">
                  <Link className="nb-link" to="/home/college">
                    Home
                  </Link>
                </li>
                <li className="nb-li">
                  <Link className="nb-link" to="/studentdata">
                    Student Data
                  </Link>
                </li>
                <li className="nb-li">
                  <Link className="nb-link" to="/myprofile">
                    My Profile
                  </Link>
                </li>
                <li className="nb-li">
                  <div className="logout-btn">
                    <button className="navbar-Btn" onClick={handleSignOut}>
                      <div className="navbar-sign">
                        <svg viewBox="0 0 512 512">
                          <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                      </div>
                      <div className="navbar-btn-text">Logout</div>
                    </button>
                  </div>
                </li>
              </>
            )}
            {role !== "student" && role !== "college" && (
              <>
                {" "}
                <li className="nb-li">
                  <Link className="nb-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nb-li">
                  <Link className="nb-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
