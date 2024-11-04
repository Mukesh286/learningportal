import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./EditCourse.css";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnapshot = await getDoc(courseRef);

        if (courseSnapshot.exists()) {
          setCourseData(courseSnapshot.data());
        } else {
          setError("Course not found.");
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, courseData);
      navigate("/manage-courses");
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course.");
    }
  };

  if (loading) return <p className="text-center">Loading course data...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className=".editCourseBody">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">
              Course Name:
              <input
                type="text"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Description:
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Image URL:
              <input
                type="text"
                name="image"
                value={courseData.image}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </form>
        {courseData.image && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">Current Image:</h3>
            <img
              src={courseData.image}
              alt="Course"
              className="mt-2 max-w-full max-h-48 mx-auto rounded-lg shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
