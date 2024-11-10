import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions

const CollegeCourse = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState([]); // State for topic data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // State for error handling
  const [courseName, setCourseName] = useState(""); // State for course name

  useEffect(() => {
    const fetchTopicsAndCourseName = async () => {
      try {
        // Fetch course name
        const coursesRef = collection(db, "courses"); // Reference to the courses collection
        const courseQuery = query(coursesRef, where("__name__", "==", id)); // Query to get the specific course
        const courseSnapshot = await getDocs(courseQuery);

        if (!courseSnapshot.empty) {
          const courseData = courseSnapshot.docs[0].data();
          setCourseName(courseData.name); // Set the course name
        }

        // Fetch topics
        const topicsRef = collection(db, "topics"); // Reference to the topics collection
        const q = query(topicsRef, where("courseId", "==", id)); // Properly set up the query

        const querySnapshot = await getDocs(q);
        const fetchedTopics = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTopicData(fetchedTopics);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchTopicsAndCourseName();
  }, [id]);

  const handleAddQuizClick = (topicId) => {
    navigate(`/college/course/${id}/topic/${topicId}/add-quiz`); // Navigate to the add quiz page for the topic
  };

  const handleAddTopicClick = () => {
    navigate(`/college/course/${id}/add-topic`); // Navigate to the add topic page
  };

  const handleManageTopicsClick = () => {
    navigate(`/college/course/${id}/manage-topics`); // Navigate to manage topics page
  };

  if (loading) return <p className="text-gray-500">Loading topics...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="courseBody">
      <div className="flex items-center justify-between">
        <button
          onClick={handleAddTopicClick}
          className="college-add-topic-button bg-blue-700 text-white py-2 px-4 rounded mr-2 hover:bg-blue-800 transition"
        >
          Add Topic
        </button>
        <h1 className="homeH1 text-center flex-grow">
          Course Name: {courseName}
        </h1>

        <button
          onClick={handleManageTopicsClick}
          className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition duration-200"
        >
          Manage Topics
        </button>
      </div>
      <div className="courseCardcontainer">
        {topicData.length > 0 ? (
          topicData.map((topic) => (
            <div className="courseCard" key={topic.id}>
              <div className="courseContent">
                <p className="courseHeading">{topic.name}</p>
                <p className="coursePara">{topic.description}</p>
                <button
                  className="courseBtn23"
                  onClick={() => handleAddQuizClick(topic.id)}
                >
                  <span className="courseBtnText">Manage Quiz</span>
                  <span aria-hidden="true" className="courseMarquee">
                    Quiz
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No topics available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CollegeCourse;
