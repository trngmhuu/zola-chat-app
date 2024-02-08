import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
        if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
        }
    };

    checkLocalStorage();

    // Không trả về bất cứ điều gì từ useEffect
    // Nếu cần, bạn có thể trả về một hàm clean-up từ useEffect
    // Nhưng trong trường hợp này, không cần thiết
  }, []);


  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const setProfilePicture = async () => {
    if (!selectedFile) {
      toast.error("Please select an image", toastOptions);
    } else {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        const response = await axios.post(`${setAvatarRoute}/${user._id}`, formData);
        console.log(response.data);
        if (response.data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = response.data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again", toastOptions);
        }
      } catch (error) {
        console.error("Error setting avatar:", error);
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };

  return (
    <>
      <Container>
        <div className="title-container">
          <h1>Set your profile picture</h1>
        </div>
        <div className="avatar-preview">
          {previewImage && <img src={previewImage} alt="Preview" />}
        </div>
        <input type="file" accept="image/*" className="inputFile" onChange={handleFileInputChange} />
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .inputFile {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatar-preview {
    img {
      max-width: 200px;
      max-height: 200px;
    }
  }

  input[type="file"] {
    margin-top: 20px;
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
