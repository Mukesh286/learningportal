import React, { useState } from "react";
import { db } from "../../../firebase-config";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { useParams, useNavigate } from "react-router-dom";
import "./AddTopic.css";

const AddTopic = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const navigate = useNavigate();

  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const topicsRef = collection(db, "topics");
      await addDoc(topicsRef, {
        name: topicName,
        description,
        courseId: id, // Associate topic with the course ID
      });
      alert("Topic added successfully!");
      navigate(`/college/course/${id}`); // Redirect to the course page
    } catch (error) {
      console.error("Error adding topic:", error);
      alert("Failed to add topic.");
    }
  };

  return (
    <div className="addTopicBody">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Add New Topic</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Topic Name"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Topic
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTopic;
