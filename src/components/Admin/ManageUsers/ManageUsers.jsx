import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "student"));
        const usersSnapshot = await getDocs(q);
        const studentsData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleEditClick = (id) => {
    navigate(`/manage-users/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const userRef = doc(db, "users", id);
        await deleteDoc(userRef);
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== id)
        );
      } catch (err) {
        console.error("Error deleting student:", err);
        setError("Failed to delete student.");
      }
    }
  };

  if (loading) return <p className="text-center">Loading students...</p>;

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="manageUsersBody">
      <div className="mt-30 p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
        <table className="min-w-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Mobile Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{student.firstName}</td>
                  <td className="py-3 px-4">{student.lastName}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.mobileNumber}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(student.id)}
                      className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(student.id)}
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No students available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="absolute bottom-4 right-4">
          <div class="group relative flex justify-center items-center text-zinc-600 text-sm font-bold">
            <div class="absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-[150%] -translate-y-[300%] duration-500 group-hover:delay-500 skew-y-[20deg] group-hover:skew-y-0 shadow-md">
              <div class="bg-lime-200 flex items-center gap-1 p-2 rounded-md">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="20px"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-zinc-600"
                >
                  <circle
                    stroke-linejoin="round"
                    r="9"
                    cy="12"
                    cx="12"
                  ></circle>
                  <path
                    stroke-linejoin="round"
                    d="M12 3C12 3 8.5 6 8.5 12C8.5 18 12 21 12 21"
                  ></path>
                  <path
                    stroke-linejoin="round"
                    d="M12 3C12 3 15.5 6 15.5 12C15.5 18 12 21 12 21"
                  ></path>
                  <path stroke-linejoin="round" d="M3 12H21"></path>
                  <path stroke-linejoin="round" d="M19.5 7.5H4.5"></path>
                  <g filter="url(#filter0_d_15_556)">
                    <path stroke-linejoin="round" d="M19.5 16.5H4.5"></path>
                  </g>
                  <defs>
                    <filter
                      color-interpolation-filters="sRGB"
                      filterUnits="userSpaceOnUse"
                      height="3"
                      width="17"
                      y="16"
                      x="3.5"
                      id="filter0_d_15_556"
                    >
                      <feFlood
                        result="BackgroundImageFix"
                        flood-opacity="0"
                      ></feFlood>
                      <feColorMatrix
                        result="hardAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        type="matrix"
                        in="SourceAlpha"
                      ></feColorMatrix>
                      <feOffset dy="1"></feOffset>
                      <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                      <feColorMatrix
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                        type="matrix"
                      ></feColorMatrix>
                      <feBlend
                        result="effect1_dropShadow_15_556"
                        in2="BackgroundImageFix"
                        mode="normal"
                      ></feBlend>
                      <feBlend
                        result="shape"
                        in2="effect1_dropShadow_15_556"
                        in="SourceGraphic"
                        mode="normal"
                      ></feBlend>
                    </filter>
                  </defs>
                </svg>
                <span>Admin</span>
              </div>
              <div class="shadow-md bg-lime-200 absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"></div>
              <div class="rounded-md bg-white group-hover:opacity-0 group-hover:scale-[115%] group-hover:delay-700 duration-500 w-full h-full absolute top-0 left-0">
                <div class="border-b border-r border-white bg-white absolute bottom-0 translate-y-1/2 left-1/2 translate-x-full rotate-45 p-1"></div>
              </div>
            </div>

            <div class="shadow-md flex items-center group-hover:gap-2 bg-gradient-to-br from-lime-200 to-yellow-200 p-3 rounded-full cursor-pointer duration-300">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                height="20px"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
                class="fill-zinc-600"
              >
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z"
                ></path>
              </svg>
              <a href="/manage-colleges">
                <span class="text-[0px] group-hover:text-sm duration-300">
                  Manage Colleges
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
