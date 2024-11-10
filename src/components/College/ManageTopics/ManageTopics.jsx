import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Import Firestore functions
import "./ManageTopics.css";

const ManageTopics = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState([]); // State for topic data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchTopics = async () => {
      try {
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

    fetchTopics();
  }, [id]);

  const handleDeleteTopic = async (topicId) => {
    try {
      await deleteDoc(doc(db, "topics", topicId)); // Delete the topic from Firestore
      setTopicData((prevData) =>
        prevData.filter((topic) => topic.id !== topicId)
      ); // Update the state
    } catch (err) {
      console.error("Error deleting topic:", err);
      setError("Failed to delete topic.");
    }
  };

  const handleEditTopicClick = (topicId) => {
    navigate(`/college/course/${id}/topic/${topicId}/edit`); // Navigate to edit topic page
  };

  // Show loading message while fetching data
  if (loading) return <p className="text-center">Loading topics...</p>;

  // Show error message if fetching fails
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="manageTopicsBody">
      <div className="p-6">
        <h1 className="homeH1 text-center flex-grow">Manage Topics</h1>{" "}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Topic Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topicData.length > 0 ? (
              topicData.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{topic.name}</td>
                  <td className="py-2 px-4 border-b">{topic.description}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEditTopicClick(topic.id)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-800 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-4 border-b text-center">
                  No topics available for this course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTopics;
