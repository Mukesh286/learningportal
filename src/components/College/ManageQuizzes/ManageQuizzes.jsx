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
} from "firebase/firestore";
import "./ManageQuizzes.css";

const ManageQuizzes = () => {
  const { topicId, id: courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = collection(db, "questions");
        const q = query(
          questionsRef,
          where("topicId", "==", topicId),
          where("courseId", "==", courseId)
        );

        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(questionsData);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId, courseId]);

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "questions", questionId));
        setQuestions(
          questions.filter((question) => question.id !== questionId)
        );
        alert("Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete question.");
      }
    }
  };

  const handleEdit = (question) => {
    navigate(`/college/course/${courseId}/edit-quiz/${question.id}`); // Navigate to the edit page for the selected question
  };

  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="manageQuizzesBody">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div
                key={question.id}
                className="p-4 border rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{question.question}</h3>
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/college/course/${courseId}`)}
          className="mt-4 bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
        >
          Back to Course
        </button>
      </div>
    </div>
  );
};

export default ManageQuizzes;
