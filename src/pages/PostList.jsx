import Post from "../components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  // ✅ Predefined categories array
  const categories = ["Programming", "Agriculture", "Coding", "HealthCare", "Tech"];

  // ✅ Fetch posts from API
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main>
      <div className="container mt-4">
        <div className="row">
          {/* ✅ Posts Section */}
          <div className="col-lg-8">
            <h1 className="mb-4">Latest Posts</h1>
            {posts.length > 0 ? (
              posts.map((post) => <Post key={post._id} post={post} />)
            ) : (
              <h3>No posts available</h3>
            )}
          </div>

          {/* ✅ Sidebar */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">About Me</h5>
                <p className="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>

            {/* ✅ Static Categories List */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <ul className="list-group">
                  {categories.map((category) => (
                    <li key={category} className="list-group-item">
                      <Link to={`/posts/category/${category}`} className="text-black">
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostList;
