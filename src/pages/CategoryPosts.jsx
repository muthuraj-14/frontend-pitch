import Post from "../components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CategoryPosts() {
    const [posts, setPosts] = useState([]);
    const { name } = useParams(); // ✅ Get category name from URL

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/posts/category/${name}`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [name]); // ✅ Fetch posts when category name changes

    if (!posts.length) {
        return <p>Loading posts...</p>;
    }

    return (
        <main>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-8">
                        <h1 className="mb-4">{name}</h1> {/* ✅ Display category name directly */}
                        {posts.length > 0 ? (
                            posts.map((post) => <Post key={post._id} post={post} />)
                        ) : (
                            <h4>No posts available</h4>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
