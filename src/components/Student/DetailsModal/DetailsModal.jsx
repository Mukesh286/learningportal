import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null; // Early return if modal is not open

  // Print the data to the console
  console.log("Modal Data:", data);

  const { correctAnswersCount = 0, totalQuestions = 0 } = data;
  const totalCorrect = correctAnswersCount; // Count of correct answers
  const totalIncorrect = totalQuestions - totalCorrect;

  const questionLabels = Array.from(
    { length: totalQuestions },
    (_, i) => `Question ${i + 1}`
  );

  const barData = {
    labels: questionLabels,
    datasets: [
      {
        label: "Correct Answers",
        data: new Array(totalQuestions)
          .fill(0)
          .map((_, i) => (i < correctAnswersCount ? 1 : 0)),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const pieData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [totalCorrect, totalIncorrect],
        backgroundColor: ["#4CAF50", "#FF6384"],
        hoverBackgroundColor: ["#66BB6A", "#FF7C7C"],
      },
    ],
  };

  return (
    <div className="DetailsModalBody">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-3 w-11/12 max-w-md animate-fadeIn">
          <h2 className="text-lg font-bold mb-3 text-center text-gray-800">
            Statistics Details
          </h2>
          <button
            className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
            type="button"
            onClick={onClose}
          >
            <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="25px"
                width="25px"
              >
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                />
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                />
              </svg>
            </div>
            <p className="translate-x-2">Go Back</p>
          </button>
          <div className="flex justify-between mb-3">
            <div className="w-1/2 pr-0">
              <Bar data={barData} options={{ responsive: true }} />
            </div>
            <div className="w-1/2 pl-2">
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
