import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching the post:', error);
            }
        };
        
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (post && post.category) {
            const fetchRelatedPosts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/posts/category/${post.category}`);
                    setRelatedPosts(response.data.slice(0, 5)); // Limit to 5 related posts
                } catch (error) {
                    console.error("Error fetching related posts:", error);
                }
            };
            
            fetchRelatedPosts();
        }
    }, [post?.category]); // ✅ Updated dependency to avoid unnecessary re-renders

    if (!post) {
        return <div>Loading...</div>;
    }

    const formattedDate = Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: "numeric",
        year: "numeric"
    }).format(new Date(post.createdAt));

    return (
        <main className="container my-4">
            <div className="row">
                <article className="col-lg-8">
                    <h2 className="blog-post-title">{post.title}</h2>
                    <p className="blog-post-meta">{formattedDate} by <a href="#">{post.author}</a></p>
                    <img className="mb-3 img-fluid" src={post.image} alt="Post" />
                    <div className="blog-post-content">
                        <p>{post.description}</p>
                    </div>
                </article>

                <aside className="col-lg-4">
                    <div className="p-4 bg-light">
                        <h3 className="mb-4">Related Posts</h3>
                        {relatedPosts.length > 0 ? (
                            relatedPosts.map((related) => (
                                <div className="mb-4" key={related._id}>
                                    <div className="row align-items-center">
                                        <div className="col-auto">
                                            <img src={related.image} className="img-fluid rounded" alt={related.title} width="100" />
                                        </div>
                                        <div className="col">
                                            <h4>
                                                <a href={`/posts/${related._id}`} className="text-decoration-none">
                                                    {related.title}
                                                </a>
                                            </h4>
                                            <p>{related.description.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No related posts available.</p>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
