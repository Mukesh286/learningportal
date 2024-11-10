import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import DetailsModal from "../DetailsModal/DetailsModal";
import "./Statistics.css";

const Statistics = () => {
  const [stats, setStats] = useState([]);
  const [courses, setCourses] = useState({});
  const [topics, setTopics] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const userId = localStorage.getItem("uid");

  const handleDetailsClick = (stat) => {
    const data = {
      correctAnswersCount: stat.score,
      totalQuestions: stat.totalQuestions,
    };
    setModalData(data);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const resultsRef = collection(db, "results");
        const resultsSnapshot = await getDocs(resultsRef);
        const resultsData = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userStats = resultsData.filter((result) => result.uid === userId);
        setStats(userStats);
        await fetchCoursesAndTopics(userStats);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [userId]);

  const fetchCoursesAndTopics = async (userStats) => {
    const courseIds = [...new Set(userStats.map((stat) => stat.courseId))];
    const topicIds = [...new Set(userStats.map((stat) => stat.topicId))];

    const coursesRef = collection(db, "courses");
    const topicsRef = collection(db, "topics");

    if (courseIds.length > 0) {
      const courseQuery = query(coursesRef, where("__name__", "in", courseIds));
      const courseSnapshot = await getDocs(courseQuery);
      const courseData = courseSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setCourses(courseData);
    }

    if (topicIds.length > 0) {
      const topicQuery = query(topicsRef, where("__name__", "in", topicIds));
      const topicSnapshot = await getDocs(topicQuery);
      const topicData = topicSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {});
      setTopics(topicData);
    }
  };

  const calculatePercentage = (correct, total) => {
    return total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
  };

  const determineStatus = (score, totalQuestions) => {
    const percentage = calculatePercentage(score, totalQuestions);
    return percentage >= 40 ? "Pass" : "Fail";
  };

  return (
    <div className="stat-Body">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <main className="overflow-x-auto">
          <section>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 border-b text-left">Course Name</th>
                  <th className="py-3 px-4 border-b text-left">Topic Name</th>
                  <th className="py-3 px-4 border-b text-left">
                    Total Questions
                  </th>
                  <th className="py-3 px-4 border-b text-left">
                    Correct Answers
                  </th>
                  <th className="py-3 px-4 border-b text-left">Percentage</th>
                  <th className="py-3 px-4 border-b text-left">Status</th>
                  <th className="py-3 px-4 border-b text-left">Details</th>
                </tr>
              </thead>

              <tbody>
                {stats.length > 0 ? (
                  stats.map((stat, index) => {
                    const courseName = courses[stat.courseId];
                    const topicName = topics[stat.topicId];

                    if (courseName && topicName) {
                      const status = determineStatus(
                        stat.score,
                        stat.totalQuestions
                      );
                      return (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="py-3 px-4 border-b">{courseName}</td>
                          <td className="py-3 px-4 border-b">{topicName}</td>
                          <td className="py-3 px-4 border-b">
                            {stat.totalQuestions}
                          </td>
                          <td className="py-3 px-4 border-b">{stat.score}</td>
                          <td className="py-3 px-4 border-b">
                            {calculatePercentage(
                              stat.score,
                              stat.totalQuestions
                            )}
                            %
                          </td>
                          <td
                            className={`py-3 px-4 border-b ${
                              status === "Pass"
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {status}
                          </td>

                          <td className="py-3 px-4 border-b">
                            <button
                              onClick={() => handleDetailsClick(stat)}
                              type="submit"
                              class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                            >
                              In Detail
                              <svg
                                class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                                viewBox="0 0 16 19"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                                  class="fill-gray-800 group-hover:fill-gray-800"
                                ></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No quiz results available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={modalData}
        />
      </div>
    </div>
  );
};

export default Statistics;
