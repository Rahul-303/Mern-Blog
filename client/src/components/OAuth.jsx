import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signInStop,
} from "../redux/user/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ promt: "select_account" });
    try {
      dispatch(signInStart());
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle.user);
      const config = {
        headers: { "Contet-Type": "application/json" },
      };
      const newUser = {
        username: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      };
      console.log(newUser);
      const res = await axios.post(
        `${server}/api/auth/google`,
        newUser,
        config
      );
      toast.success(res.data.message);
      navigate("/");
      dispatch(signInSuccess(res.data));
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="greenToBlue"
      outline
      onClick={handleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
