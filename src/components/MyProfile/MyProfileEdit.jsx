import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import "./MyProfileEdit.css";

function MyProfileEdit() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setMobileNumber(data.mobileNumber || "");
            setEmail(user.email || "");
            setUserRole(data.role || "");
            setCollegeName(data.collegeName || "");
            setAddress(data.address || "");
            setZipCode(data.zipcode || "");
          } else {
            setError("User data not found.");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);

        const updatedData = {
          firstName,
          lastName,
          mobileNumber,
          collegeName,
          address,
          zipCode,
        };

        await updateDoc(userDoc, updatedData);
        alert("Profile updated successfully!");
        navigate("/myprofile");
      }
    } catch (error) {
      setError("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-text">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="myProfileEditBody">
      <div className="MyProfileEdit max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Edit Profile</h3>
        {error && <p className="text-red-500">{error}</p>}

        {userRole === "student" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <input
                id="firstName"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="First Name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                id="lastName"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Last Name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number:
              </label>
              <input
                id="mobileNumber"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Mobile Number..."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                id="email"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Email..."
                value={email}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                id="address"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code:
              </label>
              <input
                id="zipCode"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Zip Code..."
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </>
        )}

        {userRole === "college" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="collegeName"
                className="block text-sm font-medium text-gray-700"
              >
                College Name:
              </label>
              <input
                id="collegeName"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="College Name..."
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number:
              </label>
              <input
                id="mobileNumber"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Mobile Number..."
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                id="address"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code:
              </label>
              <input
                id="zipCode"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Zip Code..."
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                id="email"
                className="border border-gray-300 p-2 w-full rounded"
                placeholder="Email..."
                value={email}
                readOnly
              />
            </div>
          </>
        )}

        <button
          onClick={handleUpdate}
          className="w-full bg-[#58b0e0] text-gray-900 font-semibold rounded-md p-2 hover:bg-[#3b8cbf] transition duration-300"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default MyProfileEdit;
