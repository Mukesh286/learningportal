import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./Course.css"; // Ensure this is correct

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState("");

  const fetchCourseName = async (courseId) => {
    const coursesRef = collection(db, "courses");
    const courseQuery = query(coursesRef, where("__name__", "==", courseId)); // Fetch by document ID
    const courseSnapshot = await getDocs(courseQuery);

    if (!courseSnapshot.empty) {
      const courseData = courseSnapshot.docs[0].data().name; // Get the course name
      setCourseName(courseData); // Set state with the course name
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        await fetchCourseName(id);
        const topicsRef = collection(db, "topics");
        const q = query(topicsRef, where("courseId", "==", id));

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
        setLoading(false);
      }
    };

    fetchTopics();
  }, [id]);

  const handleQuizClick = (topicId) => {
    navigate(`/quiz/${id}/${topicId}`);
  };

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="courseBody">
      <h1 className="homeH1">Course Name: {courseName}</h1>

      <div className="courseCardcontainer">
        {topicData.length > 0 ? (
          topicData.map((topic) => (
            <div className="courseCard" key={topic.id}>
              <div className="courseContent">
                <p className="courseHeading">{topic.name}</p>
                <p className="coursePara">{topic.description}</p>
                <button
                  className="courseBtn23"
                  onClick={() => handleQuizClick(topic.id)}
                >
                  <span className="courseBtnText">Take me Quiz</span>
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

export default Course;
