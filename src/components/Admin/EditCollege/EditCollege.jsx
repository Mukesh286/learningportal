import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditCollege = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const [collegeData, setCollegeData] = useState({
    collegeName: "",
    email: "",
    mobileNumber: "",
    address: "",
    zipcode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        const collegeRef = doc(db, "users", collegeId);
        const collegeSnapshot = await getDoc(collegeRef);

        if (collegeSnapshot.exists()) {
          setCollegeData(collegeSnapshot.data());
        } else {
          setError("College not found.");
        }
      } catch (err) {
        console.error("Error fetching college data:", err);
        setError("Failed to load college data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollegeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collegeRef = doc(db, "users", collegeId);
      await updateDoc(collegeRef, collegeData);
      navigate("/manage-colleges");
    } catch (err) {
      console.error("Error updating college:", err);
      setError("Failed to update college.");
    }
  };

  if (loading) return <p className="text-center">Loading college data...</p>;

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="mt-30 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit College</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            College Name:
            <input
              type="text"
              name="collegeName"
              value={collegeData.collegeName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email:
            <input
              type="email"
              name="email"
              value={collegeData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Mobile Number:
            <input
              type="text"
              name="mobileNumber"
              value={collegeData.mobileNumber}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address:
            <input
              type="text"
              name="address"
              value={collegeData.address}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Zipcode:
            <input
              type="text"
              name="zipcode"
              value={collegeData.zipcode}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCollege;
