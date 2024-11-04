import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config"; // Import your Firebase configuration
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore functions
import "./StudentData.css";

const StudentData = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState({});
  const [topics, setTopics] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter only students
        const filteredStudents = usersData.filter(
          (user) => user.role === "student"
        );
        setStudents(filteredStudents);
        await fetchCoursesAndTopics(filteredStudents);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const fetchCoursesAndTopics = async (studentsData) => {
    const userIds = studentsData.map((student) => student.id);

    try {
      const resultsRef = collection(db, "results");
      const resultsSnapshot = await getDocs(resultsRef);
      const resultsData = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredResults = resultsData.filter((result) =>
        userIds.includes(result.uid)
      );

      const courseIds = [
        ...new Set(filteredResults.map((result) => result.courseId)),
      ];
      const topicIds = [
        ...new Set(filteredResults.map((result) => result.topicId)),
      ];

      const coursesRef = collection(db, "courses");
      const topicsRef = collection(db, "topics");

      // Fetch courses
      if (courseIds.length > 0) {
        const courseQuery = query(
          coursesRef,
          where("__name__", "in", courseIds)
        );
        const courseSnapshot = await getDocs(courseQuery);
        const courseData = courseSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});
        setCourses(courseData);
      }

      // Fetch topics
      if (topicIds.length > 0) {
        const topicQuery = query(topicsRef, where("__name__", "in", topicIds));
        const topicSnapshot = await getDocs(topicQuery);
        const topicData = topicSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});
        setTopics(topicData);
      }

      // Combine student data with results
      const combinedData = studentsData.map((student) => {
        const studentResults = filteredResults.filter(
          (result) => result.uid === student.id
        );
        return {
          student,
          results: studentResults,
        };
      });

      setStudents(combinedData);
    } catch (error) {
      console.error("Error fetching courses and topics:", error);
    }
  };

  const calculatePercentage = (correct, total) => {
    return total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
  };

  return (
    <div className="studentDataBody">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Student Data Overview
        </h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b text-left">Student Name</th>
              <th className="py-2 px-4 border-b text-left">Course Name</th>
              <th className="py-2 px-4 border-b text-left">Topic Name</th>
              <th className="py-2 px-4 border-b text-left">Total Questions</th>
              <th className="py-2 px-4 border-b text-left">Correct Answers</th>
              <th className="py-2 px-4 border-b text-left">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((studentData, index) =>
                studentData.results && studentData.results.length > 0
                  ? studentData.results.map((result, resultIndex) => {
                      const courseName = courses[result.courseId];
                      const topicName = topics[result.topicId];

                      if (courseName && topicName) {
                        return (
                          <tr
                            key={`${index}-${resultIndex}`}
                            className="hover:bg-gray-100"
                          >
                            <td className="py-2 px-4 border-b">
                              {studentData.student?.firstName ||
                                "Unknown Student"}{" "}
                              {studentData.student?.lastName || ""}
                            </td>
                            <td className="py-2 px-4 border-b">{courseName}</td>
                            <td className="py-2 px-4 border-b">{topicName}</td>
                            <td className="py-2 px-4 border-b">
                              {result.totalQuestions}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {result.score}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {calculatePercentage(
                                result.score,
                                result.totalQuestions
                              )}
                              %
                            </td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  : null
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No student data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentData;
