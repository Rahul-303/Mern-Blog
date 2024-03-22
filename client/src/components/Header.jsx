import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  NavbarCollapse,
  TextInput,
  theme,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import axios from "axios";
//import { server } from "../server";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/user/signout`);
      dispatch(signOutSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-green-400 via-cyan-600 to-blue-500 rounded-lg text-white">
          META
        </span>
        Blogs
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <>
            <Dropdown
              inline
              arrowIcon={false}
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                ></Avatar>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Header>
                <Link to="/dashboard">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
              </Dropdown.Header>
              <Dropdown.Divider></Dropdown.Divider>
              <Dropdown.Header>
                <Button
                  gradientDuoTone="greenToBlue"
                  outline
                  onClick={handleSignOut}
                >
                  sign out
                </Button>
              </Dropdown.Header>
            </Dropdown>
          </>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="greenToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
