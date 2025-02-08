import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <Link to={`/post/${post._id}`} className="text-decoration-none text-dark">
      <div className="card mb-4 shadow-sm">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <img
              className="img-fluid rounded-start w-100"
              src={post.image}
              alt={post.title}
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title mb-2">{post.title}</h5>
              <p className="card-text text-muted mb-3">
                {post.description.substring(0, 50)}...
              </p>

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
