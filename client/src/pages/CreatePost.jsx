import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [noImageError, setNoImageError] = useState(false);
  const [imageProgress, setImageProgress] = useState(null);
  const [formData, setFormData] = useState({});

  const handleImageInput = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setImageUrl(URL.createObjectURL(imageFile));
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
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
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
        {noImageError ? (
        <span className="text-red-700">Please select an image to upload</span>
        ) : ''}
        {
          imageError ? (
            <span className="text-red-700">Something went wrong!</span>
          ) : (
          ""
        )
        }
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
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
