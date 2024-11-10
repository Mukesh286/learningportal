import React, { useState } from "react";
import { db } from "../../../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AddCourse.css";

const AddCourse = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coursesRef = collection(db, "courses");
      await addDoc(coursesRef, {
        name: courseName,
        description,
        image,
      });
      alert("Course added successfully!");
      navigate("/home/college");
      setCourseName("");
      setDescription("");
      setImage("");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course.");
    }
  };

  return (
    <div className="addCourseBody">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Add New Course
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="sr-only">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="sr-only">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
