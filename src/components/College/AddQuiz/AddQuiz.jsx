import React, { useState } from "react";
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { useParams, useNavigate } from "react-router-dom";
import "./AddQuiz.css";

const AddQuiz = () => {
  const { topicId, id: courseId } = useParams(); // Get the course and topic IDs from the URL
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]); // Initialize with four empty options
  const [answer, setAnswer] = useState(0); // Default answer index

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quizzesRef = collection(db, "questions"); // Assuming a questions collection
      await addDoc(quizzesRef, {
        question,
        options,
        answer,
        topicId,
        courseId,
      });
      alert("Quiz added successfully!");
      navigate(`/college/course/${courseId}`); // Redirect to the course page
    } catch (error) {
      console.error("Error adding quiz:", error);
      alert("Failed to add quiz.");
    }
  };

  const handleManageQuizClick = () => {
    navigate(`/college/course/${courseId}/manage-quiz/${topicId}`); // Redirect to the manage quizzes page
  };

  return (
    <div className="addQuizBody">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Add New Quiz</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          ))}
          <div>
            <label className="block mb-1">
              Correct Answer Index:
              <input
                type="number"
                min="0"
                max="3"
                value={answer}
                onChange={(e) => setAnswer(Number(e.target.value))}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
            <p>index 0: a, index 1: b, index 2: c, index 3: d</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Quiz
          </button>
        </form>
        <button
          onClick={handleManageQuizClick}
          className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Manage Quizzes
        </button>
      </div>
    </div>
  );
};

export default AddQuiz;
