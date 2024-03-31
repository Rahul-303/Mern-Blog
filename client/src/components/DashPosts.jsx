import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState("");

  const handleShowMore = async (e) => {
    const index = posts.length;
    e.preventDefault();
    try {
      const res = await axios.get(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${index}`
      );
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      if (res.data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      setError(true);
    }
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/post/deletePosts/${postId}/${currentUser._id}`
      );
      setPosts((prevPost) => {
        prevPost.filter((post) => post._id !== postId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        setPosts(res.data.posts);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    if (currentUser.isCreator) {
      fetch();
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isCreator && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="table-auto">
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={post._id}
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-700 hover:underline cursor-pointer"
                      onClick={() => {
                        setPostId(post._id);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="font-medium text-teal-500 hover:underline cursor-pointer">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full self-center text-teal-500 py-2"
            >
              Show More..
            </button>
          )}
        </>
      ) : error ? (
        <span className="self-center text-red-700">
          <h2>Something went wrong!</h2>
        </span>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 dark:text-red-700 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                gradientDuoTone="purpleToBlue"
                outline
                onClick={handleDeletePost}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Deleting...</span>
                  </>
                ) : (
                  "Yes, I'm sure"
                )}
              </Button>

              <Button
                gradientDuoTone="greenToBlue"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
