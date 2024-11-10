// src/components/CollegeHome.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import "./CollegeHome.css"; // Optional: Import CSS for styling

const CollegeHome = () => {
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
    navigate(`/college/course/${courseId}`); // Navigate to the course page
  };

  const handleAddCourseClick = () => {
    navigate("/college/add-course"); // Navigate to the add course page
  };

  const handleManageCourseClick = () => {
    navigate("/manage-courses"); // Navigate to the add course page
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
    ); // Show loading message while fetching data
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Show error message if fetching fails
  }

  return (
    <div className="collegehomeBody">
      <div className="flex items-center justify-between">
        <button
          onClick={handleAddCourseClick}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Add Course
        </button>
        <h1 className="collegehomeH1 text-center flex-grow">Courses</h1>
        <button
          onClick={handleManageCourseClick}
          className="px-4 py-2 bg-green-800 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          Manage Courses
        </button>
      </div>

      <div className="collegehomeCardContainer">
        {courses.map((course) => (
          <div
            className="collegehomeCard"
            key={course.id}
            onClick={() => handleCardClick(course.id)} // Add click handler
            style={{ cursor: "pointer" }} // Change cursor on hover
          >
            <img
              className="collegeimg"
              src={course.image || "https://via.placeholder.com/150"}
              alt={course.name}
            />
            <div class="collegehomeCardcontent">
              <p class="collegehomeCardtitle">{course.name}</p>
              <p class="collegehomeCarddescription">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeHome;
