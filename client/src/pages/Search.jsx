import axios from "axios";
import { Select, TextInput,Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const [sideBarData, setsideBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setsideBarData({
        ...sideBarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await axios.get(`/api/post/getposts?${searchQuery}`);
        setLoading(false);
        setPosts(res.data.posts);
        if (res.data.posts.length < 9 && res.data.totalPosts > 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setsideBarData({ ...sideBarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("category", sideBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const searchQuery = urlParams.toString();
      const res = await axios.get(`/api/post/getposts?${searchQuery}`);
      setPosts([...posts, ...res.data.posts]);
      if (res.data.posts.length < 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = async(e) => {
    const res = await axios.get(`/api/post/getposts`);
      setPosts(res.data.posts);
      if (res.data.posts.length < 9 && res.data.totalPosts > 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    setsideBarData({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
      })
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sideBarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sideBarData.category}
              id="category"
            >
              <option value="uncategorized"> Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.Js</option>
            <option value="nodejs">Node.Js</option>
            <option value="java">Java</option>
            <option value="springboot">Spring Boot</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
          <Button type="submit" outline gradientDuoTone="purpleToBlue" onClick={handleReset}>
            Reset Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
