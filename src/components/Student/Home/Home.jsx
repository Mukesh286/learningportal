import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, "courses");
        const querySnapshot = await getDocs(coursesRef);
        const fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId) => {
    navigate(`/home/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loading-wrapper">
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
          <div className="loading-circle"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="homeBody">
      <h1 className="homeH1">Courses</h1>
      <h2 className="visually-hidden">Available Courses</h2>{" "}
      {/* Proper heading for the course section */}
      <div className="homeCardContainer">
        {courses.map((course) => (
          <div
            className="homeCard"
            key={course.id}
            onClick={() => handleCardClick(course.id)}
            style={{ cursor: "pointer" }}
            aria-label={`Go to ${course.name} details`} // Accessible label for screen readers
          >
            <img
              src={course.image || "https://via.placeholder.com/150"}
              alt={course.name || "Course image"} // Ensure alt text is meaningful
              className="homeCourseimage"
            />
            <div className="homeCardcontent">
              <p className="homeCardtitle">{course.name}</p>
              <p className="homeCarddescription">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
      <noscript>
        <p>
          This website requires JavaScript to function correctly. Please enable
          JavaScript in your browser.
        </p>
      </noscript>
    </div>
  );
};

export default Home;
