import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import "./Quiz.css"; // Keep your custom styles

const Quiz = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions(courseId, topicId);
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, topicId]);

  const getQuestions = async (courseId, topicId) => {
    const questionsRef = collection(db, "questions");
    const q = query(
      questionsRef,
      where("courseId", "==", courseId),
      where("topicId", "==", topicId)
    );

    const querySnapshot = await getDocs(q);
    const questionsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return questionsData;
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
  };

  const nextQuestion = () => {
    const currentQuestionData = questions[currentQuestion];
    if (selectedOption !== null && currentQuestionData) {
      if (selectedOption === currentQuestionData.answer) {
        setScore((prevScore) => prevScore + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
      } else {
        saveResults(
          score + (selectedOption === currentQuestionData.answer ? 1 : 0)
        );
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const saveResults = async (finalScore) => {
    const resultsRef = collection(db, "results");
    try {
      await addDoc(resultsRef, {
        uid,
        courseId,
        topicId,
        score: finalScore,
        totalQuestions: questions.length,
      });
      alert(
        `Quiz completed! Your score: ${finalScore} out of ${questions.length}`
      );
      navigate("/statistics");
    } catch (error) {
      console.error("Error saving results: ", error);
      alert("There was an error saving your results. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="Quiz flex items-center justify-center h-auto mt-32">
      <div className="radio-input flex flex-col p-4 bg-white text-black rounded-lg shadow-lg w-80">
        <div className="info mb-3 flex justify-between items-center">
          <span className="question text-lg font-bold">
            {questions[currentQuestion]?.question}
          </span>
          <span className="steps bg-black text-white px-2 py-1 rounded">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>

        {questions[currentQuestion]?.options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              id={`value-${index}`}
              name="value-radio"
              checked={selectedOption === index}
              onChange={() => handleAnswer(index)}
              className="hidden"
            />
            <label
              htmlFor={`value-${index}`}
              className={`flex-1 p-3 border rounded-lg cursor-pointer transition duration-200 
                ${
                  selectedOption === index
                    ? "bg-gray-200 border-gray-600"
                    : "bg-white border-gray-300"
                }
                hover:bg-gray-100`}
            >
              {option}
            </label>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={selectedOption === null}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
