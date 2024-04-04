import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/post/getposts`);
        console.log(res.data);
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  const handleCreator = () =>{

  }
  return (
    <>
    <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to META Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
        <p className="text-xl font-bold lg:text-3xl">want to share you knowledge?</p>
        <p className="text-md sm:text-sm text-blue-500 font-bold hover:underline cursor-pointer" onClick={handleCreator}>join as a creator now!</p>
      </div>
      <div className="text-center gap-6 ">
      
      </div>
      <div className="ml-10 mr-10">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
