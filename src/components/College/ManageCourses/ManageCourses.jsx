import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./ManageCourses.css";

const ManageCourses = () => {
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

  const handleAddCourseClick = () => {
    navigate("/college/add-course");
  };

  const handleEditCourseClick = (courseId) => {
    navigate(`/manage-courses/edit/${courseId}`);
  };

  const handleDeleteCourseClick = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", courseId));
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
      } catch (err) {
        console.error("Error deleting course:", err);
        setError("Failed to delete course.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading courses...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="manageCoursesBody">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Courses</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddCourseClick}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Add Course
          </button>
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">Course Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-100">
                  <td className="border-t py-3 px-4">{course.name}</td>
                  <td className="border-t py-3 px-4">{course.description}</td>
                  <td className="border-t py-3 px-4">
                    <button
                      onClick={() => handleEditCourseClick(course.id)}
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourseClick(course.id)}
                      className="px-2 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;
