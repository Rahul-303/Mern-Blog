import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiAnnotation, HiArrowRight, HiArrowSmRight, HiDocument, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch  = useDispatch();
  const {currentUser} = useSelector(state => state.user);

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const tabFromURL = URLParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              label={currentUser.isCreator ? 'Creator' : 'User'}
              icon={HiUser}
              labelColor="dark"
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {
            currentUser.isCreator && (
              <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash"}
                icon={HiAnnotation}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
            )
          }
          {
            currentUser.isCreator && (
              <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocument}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
            )
          }
              <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          
          <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick ={handleSignOut}>
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
