import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [noImageError, setNoImageError] = useState(false);
  const [imageProgress, setImageProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(formData);
  const handleImageInput = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
  };

  const handleImageUpload = () => {
    if (!file) {
      setNoImageError(true);
      return;
    }
    setNoImageError(false);
    try {
      setImageError(false);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageProgress(progress.toFixed(0));
        },
        (error) => {
          setImageError(true);
          setImageProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageError(false);
            setFormData({ ...formData, image: downloadURL });
            setImageProgress(null);
          });
        }
      );
    } catch (error) {
      setImageError(true);
      setImageProgress(null);
      console.log(error);
    }
  };

  const handlePublish = async (e) => {
    setLoading(true);
    setPublishError(null);
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/post/create", formData, config);
      console.log(res);
      setLoading(false);
      navigate(`/post/${res.data._id}`);
    } catch (error) {
      setPublishError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handlePublish}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />
           <TextInput
            type="text"
            placeholder="Description"
            required
            id="description"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />
          <Select
            id="category"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          >
            <option value="uncategorized"> Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.Js</option>
            <option value="nodejs">Node.Js</option>
            <option value="java">Java</option>
            <option value="springboot">Spring Boot</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={handleImageInput} />
          <Button
            type="button"
            gradientDuoTone="greenToBlue"
            size="sm"
            outline
            onClick={handleImageUpload}
          >
            {imageProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageProgress}
                  text={`${imageProgress || 0}`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        <div className="self-center">
          {noImageError ? (
            <span className="text-red-700">
              Please select an image to upload
            </span>
          ) : (
            ""
          )}
          {imageError ? (
            <span className="text-red-700">Something went wrong!</span>
          ) : (
            ""
          )}
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt=" post image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="write something here..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <div className="self-center">
        {publishError && <span className="text-red-700">{publishError}</span>}
        </div>
        <Button type="submit" gradientDuoTone="purpleToBlue" disabled={loading}>
          {loading ?(
            <>
              <Spinner size="sm" />
              <span className="pl-3">Publishing...</span>
            </>
          )
          : 'Publish'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
