import {
  Button,
  FloatingLabel,
  Spinner,
} from "flowbite-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      passwordRef.current.focus();
    }
  };

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill out all the fields!"));
    }
    const config = {
      headers: { "Contet-Type": "application/json" },
    };
    try {
      dispatch(signInStart());
      const res = await axios.post(`/api/auth/signin`, formData, config);
      //setFormData({});
      toast.success(res.data.message);
      navigate("/");
      dispatch(signInSuccess(res.data));
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-green-400 via-cyan-600 to-blue-500 rounded-lg text-white">
              META
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            You can signin with your email and password.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="mt-1 relative">
              <FloatingLabel
                variant="outlined"
                label="your email"
                type="email"
                id="email"
                onChange={HandleChange}
                autoFocus
                onKeyDown={handleKeyPress}
                ref={emailRef}
              />
            </div>
            <div>
              <div className="mt-1 relative">
                <FloatingLabel
                  className="text-md"
                  variant="outlined"
                  label="your password"
                  type={visible ? "text" : "password"}
                  id="password"
                  onChange={HandleChange}
                  ref={passwordRef}
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          <div className="text-md self-center">
            <p className="text-red-700 mt-5">{error && <>{error}</>}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
