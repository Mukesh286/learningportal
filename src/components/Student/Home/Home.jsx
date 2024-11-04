// src/components/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import "./Home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [courses, setCourses] = useState([]); // State for storing courses
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = collection(db, "courses"); // Reference to the courses collection
        const querySnapshot = await getDocs(coursesRef);
        const fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(fetchedCourses); // Update state with fetched courses
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId) => {
    navigate(`/home/course/${courseId}`); // Navigate to the course page
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div class="loading-wrapper">
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
          <div class="loading-shadow"></div>
          <div class="loading-shadow"></div>
          <div class="loading-shadow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Show error message if fetching fails
  }

  return (
    <div className="homeBody">
      <h1 className="homeH1">Courses</h1>
      <div className="homeCardContainer">
        {courses.map((course) => (
          <div
            className="homeCard"
            key={course.id}
            onClick={() => handleCardClick(course.id)} // Add click handler
            style={{ cursor: "pointer" }} // Change cursor on hover
          >
            <img
              src={course.image || "https://via.placeholder.com/150"}
              alt={course.name}
              className="homeCourseimage"
            />
            <div class="homeCardcontent">
              <p class="homeCardtitle">{course.name}</p>
              <p class="homeCarddescription">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
