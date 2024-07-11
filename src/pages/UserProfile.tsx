import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { FaRegSave } from "react-icons/fa";

interface UserProfileState {
  username: string;
  picture?: string;
  id: number;
  role_id: number;
  age: number;
  gender: string;
  birth_year: number;
  address?: string;
}

interface UserProfileProps extends UserProfileState {
  isEditing: boolean;
  newPicture?: File;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileProps | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = sessionStorage.getItem("user_id");
      const token = sessionStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setProfile({ ...data, isEditing: false });
        } else {
          const errorData = response.data;
          setError(errorData.detail || "Failed to fetch user profile.");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prevState) =>
      prevState ? { ...prevState, [name]: value } : null
    );
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setProfile((prevState) =>
        prevState ? { ...prevState, birth_year: date.getFullYear() } : null
      );
    }
  };

  const handleSave = async () => {
    toast.success("Profile saved!", {
      icon: <FaRegSave />,
    });

    if (!profile) return;
    const { id, username, gender, birth_year, address } = profile;
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/user/profile/${id}`,
        { username, gender, birth_year, address },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedProfile = response.data;
        setProfile({ ...updatedProfile, isEditing: false });
      } else {
        const errorData = response.data;
        setError(errorData.detail || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
      <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
          <div className="flex items-center">
            <Link to="/">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Edit Profile</h1>
          </div>
          <div className="animate-fade bg-white border-2 border-gray-200 shadow-lg rounded-lg flex flex-col items-center px-8 py-8 sm:px-12 lg:px-16 lg:py-12">
            <div className="w-full max-w-xl lg:max-w-3xl">
              <form className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="text-gray-700">Username:</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 mt-1 rounded-sm border border-gray-300 focus:ring-0 focus:border-blue-500"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700">Gender:</label>
                    <select
                      className="w-full px-3 py-2 mt-1 rounded-sm border border-gray-300 focus:ring-0 focus:border-blue-500"
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unspecified">Unspecified</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700">Birth Year:</label>
                    <DatePicker
                      selected={new Date(profile.birth_year, 0, 1)}
                      onChange={handleDateChange}
                      showYearPicker
                      dateFormat="yyyy"
                      className="w-full px-3 py-2 mt-1 rounded-sm border border-gray-300 focus:ring-0 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700">Address:</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 mt-1 rounded-sm border border-gray-300 focus:ring-0 focus:border-blue-500"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    type="button"
                    onClick={handleSave}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;
