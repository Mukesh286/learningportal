import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import "./EditTopic.css";

const EditTopic = () => {
  const { topicId } = useParams(); // Get the topic ID from the URL
  const navigate = useNavigate();

  const [topicData, setTopicData] = useState({ name: "", description: "" }); // State for topic data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const topicRef = doc(db, "topics", topicId); // Reference to the topic document
        const topicSnapshot = await getDoc(topicRef);

        if (topicSnapshot.exists()) {
          setTopicData(topicSnapshot.data());
        } else {
          setError("Topic not found.");
        }
      } catch (err) {
        console.error("Error fetching topic data:", err);
        setError("Failed to load topic data.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchTopicData();
  }, [topicId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTopicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const topicRef = doc(db, "topics", topicId);
      await updateDoc(topicRef, topicData); // Update topic in Firestore
      navigate(-1); // Navigate back to the previous page
    } catch (err) {
      console.error("Error updating topic:", err);
      setError("Failed to update topic.");
    }
  };

  // Show loading message while fetching data
  if (loading) return <p className="text-center">Loading topic data...</p>;

  // Show error message if fetching fails
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="editTopicBody">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Topic</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Topic Name:
              <input
                type="text"
                name="name"
                value={topicData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
              <textarea
                name="description"
                value={topicData.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTopic;
