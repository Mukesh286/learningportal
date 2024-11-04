import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    collegeName: "",
    address: "",
    zipCode: "",
    userRole: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="profile-card w-[300px] rounded-md shadow-xl overflow-hidden z-[100] relative bg-white flex flex-col items-center justify-center gap-3 p-5 transition-all duration-300 group">
        <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1">
          <div className="img_container w-full flex items-center justify-center relative z-40">
            <svg
              className="size-36 z-40 border-4 border-white rounded-full group-hover:border-8 transition-all duration-300"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 2l28 20-28 20-28-20L32 2zm0 22l24 16-8 6-16-12-16 12-8-6 24-16z"
                fill="#58b0e0"
              />
            </svg>
            <div className="absolute bg-[#58b0e0] z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-300 transition-all duration-300 delay-700 group-hover:delay-0"></div>
          </div>
        </div>
        <div className="headings text-center leading-4">
          <p className="text-xl font-serif font-semibold text-[#434955]">
            {userInfo.firstName} {userInfo.lastName}
          </p>
          <p className="text-sm font-semibold text-[#434955]">
            {userInfo.userRole}
          </p>
        </div>
        <div className="w-full items-center justify-center flex">
          <ul className="flex flex-col items-start gap-2 pb-3">
            <li className="flex items-center gap-2 border-b border-dotted border-b-stone-700 text-xs font-semibold text-[#434955]">
              <svg
                className="fill-stone-700 group-hover:fill-[#58b0e0]"
                height="15"
                width="15"
                viewBox="0 0 24 24"
              >
                <path d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"></path>
              </svg>
              <p>{userInfo.mobileNumber}</p>
            </li>
            <li className="flex items-center gap-2 border-b border-dotted border-b-stone-700 text-xs font-semibold text-[#434955]">
              <svg
                className="fill-stone-700 group-hover:fill-[#58b0e0]"
                height="15"
                width="15"
                viewBox="0 0 32 32"
              >
                <path d="M16,14.81,28.78,6.6A3,3,0,0,0,27,6H5a3,3,0,0,0-1.78.6Z"></path>
                <path d="M16.54,16.84h0l-.17.08-.08,0A1,1,0,0,1,16,17h0a1,1,0,0,1-.25,0l-.08,0-.17-.08h0L2.1,8.26A3,3,0,0,0,2,9V23a3,3,0,0,0,3,3H27a3,3,0,0,0,3-3V9a3,3,0,0,0-.1-.74Z"></path>
              </svg>
              <p>{userInfo.email}</p>
            </li>
            <li className="flex items-center gap-2 border-b border-dotted border-b-stone-700 text-xs font-semibold text-[#434955]">
              <svg
                className="fill-stone-700 group-hover:fill-[#58b0e0]"
                height="15"
                width="15"
                viewBox="0 0 24 24"
              >
                <path d="M22 12A10 10 0 0 0 12 2a10 10 0 0 0 0 20 10 10 0 0 0 10-10zm-2.07-1H17a12.91 12.91 0 0 0-2.33-6.54A8 8 0 0 1 19.93 11z"></path>
                <path d="M9.08 13H15a11.44 11.44 0 0 1-3 6.61A11 11 0 0 1 9.08 13zm0-2A11.4 11.4 0 0 1 12 4.4a11.19 11.19 0 0 1 3 6.6zm.36-6.57A13.18 13.18 0 0 0 7.07 11h-3a8 8 0 0 1 5.37-6.57z"></path>
                <path d="M4.07 13h3a12.86 12.86 0 0 0 2.35 6.56A8 8 0 0 1 4.07 13zm10.55 6.55A13.14 13.14 0 0 0 17 13h2.95a8 8 0 0 1-5.33 6.55z"></path>
              </svg>
              <p>{userInfo.collegeName}</p>
            </li>
            <li className="flex items-center gap-2 text-xs font-semibold text-[#434955]">
              <svg
                className="fill-stone-700 group-hover:fill-[#58b0e0]"
                height="15"
                width="15"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.2 0 3 2.2 3 5s4 11 5 11 5-8.2 5-11-2.2-5-5-5zm0 8C6.3 8 5 6.7 5 5s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"></path>
              </svg>
              <p>
                {userInfo.address}, {userInfo.zipCode}
              </p>
            </li>
          </ul>
        </div>
        <hr className="w-full group-hover:h-5 h-3 bg-[#58b0e0] transition-all duration-300" />
        <button
          onClick={() => navigate("/myprofileedit")}
          className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
        >
          Edit
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-green-200 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-bottom"></span>
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-green-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-bottom"></span>
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-green-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-bottom"></span>
          <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
            Update
          </span>
        </button>
      </div>
    </div>
  );
}

export default MyProfile;
