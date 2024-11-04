import React, { useState, useEffect } from "react";
import { db } from "../../../firebase-config";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./EditQuiz.css";

const EditQuiz = () => {
  const { questionId, id: courseId } = useParams();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const docRef = doc(db, "questions", questionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuestionData(docSnap.data());
        } else {
          setError("Question not found.");
        }
      } catch (err) {
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, questionData);
      alert("Quiz updated successfully!");
      navigate(`/college/course/${courseId}`); // Redirect to the course page
    } catch (error) {
      console.error("Error updating quiz:", error);
      alert("Failed to update quiz.");
    }
  };

  if (loading) return <p className="text-center">Loading question...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="editQuizBody">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-700">Question:</p>
            <input
              type="text"
              placeholder="Question"
              value={questionData.question}
              onChange={(e) =>
                setQuestionData({ ...questionData, question: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          {questionData.options.map((option, index) => (
            <div className="mb-4" key={index}>
              <p className="block text-sm font-medium text-gray-700">
                Option {index + 1}:
              </p>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Correct Answer Index:
              <input
                type="number"
                min="0"
                max="3"
                value={questionData.answer}
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    answer: Number(e.target.value),
                  })
                }
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Update Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
