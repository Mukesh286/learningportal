import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth, db } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "tailwindcss/tailwind.css";

//Components
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyProfileEdit from "./components/MyProfile/MyProfileEdit";
import MyProfile from "./components/MyProfile/MyProfile";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Student/Home/Home";
import Course from "./components/Student/Course/Course";
import Quiz from "./components/Student/Quiz/Quiz";
import Statistics from "./components/Student/Statistics/Statistics";

//College
import CollegeHome from "./components/College/CollegeHome/CollegeHome";
import AddCourse from "./components/College/AddCourse/AddCourse";
import CollegeCourse from "./components/College/CollegeCourse/CollegeCourse";
import AddTopic from "./components/College/AddTopic/AddTopic";
import AddQuiz from "./components/College/AddQuiz/AddQuiz";
import ManageQuizzes from "./components/College/ManageQuizzes/ManageQuizzes";
import EditQuiz from "./components/College/EditQuiz/EditQuiz";
import StudentData from "./components/College/StudentData/StudentData";
import ManageCourses from "./components/College/ManageCourses/ManageCourses";
import EditCourse from "./components/College/EditCourse/EditCourse";
import ManageTopics from "./components/College/ManageTopics/ManageTopics";
import EditTopic from "./components/College/EditTopic/EditTopic";

//Admin
import ManageUsers from "./components/Admin/ManageUsers/ManageUsers";
import EditUser from "./components/Admin/EditUser/EditUser";
import ManageColleges from "./components/Admin/ManageColleges/ManageColleges";
import EditCollege from "./components/Admin/EditCollege/EditCollege";

export default function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRole = await fetchUserRole(user.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().role : null;
  };

  return (
    <Router>
      {<Navbar role={role} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/course/:id" element={<Course />} />
        <Route path="/quiz/:courseId/:topicId" element={<Quiz />} />
        <Route path="/statistics" element={<Statistics />} />

        <Route path="/manage-users" element={<ManageUsers />} />

        <Route path="/manage-users/edit/:userId" element={<EditUser />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myprofileedit" element={<MyProfileEdit />} />
        <Route path="/manage-colleges" element={<ManageColleges />} />

        <Route
          path="/manage-colleges/edit/:collegeId"
          element={<EditCollege />}
        />

        <Route path="/home/college" element={<CollegeHome />} />
        <Route path="/college/add-course" element={<AddCourse />} />
        <Route path="/college/course/:id" element={<CollegeCourse />} />
        <Route path="/college/course/:id/add-topic" element={<AddTopic />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route
          path="/college/course/:id/topic/:topicId/add-quiz"
          element={<AddQuiz />}
        />
        <Route
          path="/college/course/:id/manage-quiz/:topicId"
          element={<ManageQuizzes />}
        />
        <Route
          path="/college/course/:id/edit-quiz/:questionId"
          element={<EditQuiz />}
        />
        <Route path="/studentdata" element={<StudentData />} />
        <Route path="/manage-courses/edit/:courseId" element={<EditCourse />} />
        <Route
          path="/college/course/:id/topic/:topicId/edit"
          element={<EditTopic />}
        />

        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myprofileedit" element={<MyProfileEdit />} />
        <Route
          path="/college/course/:id/manage-topics"
          element={<ManageTopics />}
        />
      </Routes>
    </Router>
  );
}
