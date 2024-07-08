import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
        const response = await fetch(`http://127.0.0.1:8000/user/profile/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({ ...data, isEditing: false });
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to fetch user profile.");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    setProfile(prevState => prevState ? { ...prevState, isEditing: true } : null);
  };

  const handleCancel = () => {
    setProfile(prevState => prevState ? { ...prevState, isEditing: false } : null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => prevState ? { ...prevState, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!profile) return;
    const { id, username, gender, birth_year, address } = profile;
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/user/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, gender, birth_year, address })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile({ ...updatedProfile, isEditing: false });
      } else {
        const errorData = await response.json();
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
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
      <header className="sticky top-0 bg-neutral z-50">
                  <Navbar />
                  </header>
        <div className="bg-white border-2 border-black flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              User Profile
            </h1>
            <div className="mt-4 leading-relaxed text-gray-500">
              {profile.isEditing ? (
                <>
                  <div>
                    <label>Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div>
                    <label>Picture:</label>
                    <input
                      type="text"
                      name="picture"
                      value={profile.picture}
                      onChange={handleChange}
                    />
                  </div> */}
                  <div>
                    <label>Gender:</label>
                    <input
                      type="text"
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Birth Year:</label>
                    <input
                      type="number"
                      name="birth_year"
                      value={profile.birth_year}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <button onClick={handleSave}>Save Profile</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                  <>
                  {profile.picture && <img src={profile.picture} alt="Profile" />}
                  <p><strong>Username:</strong> {profile.username}</p>
                  <p><strong>Age:</strong> {profile.age}</p>
                  <p><strong>Gender:</strong> {profile.gender}</p>
                  <p><strong>Birth Year:</strong> {profile.birth_year}</p>
                  <p><strong>Address:</strong> {profile.address || "N/A"}</p>
                  
                  <button onClick={handleEdit}>Edit Profile</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
