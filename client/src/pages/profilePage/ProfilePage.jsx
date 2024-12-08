import { useContext, useState } from "react";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRegues";
import "./profilePage.scss";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProfilePage() {
  const [data, chats] = useLoaderData();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              Email: <b>{currentUser.email}</b>
            </span>
            <button disabled={isLoading} onClick={handleLogout}>
              Logout
            </button>
            {error && <p>{error}</p>}
          </div>
          <div className="title">
            <h1>My Lists</h1>
            <Link to="/add">
              <button>Create new Post</button>
            </Link>
          </div>

          {data.userPosts && data.userPosts.length > 0 ? (
            <List listData={data.userPosts} />
          ) : (
            <p
              style={{
                color: "#555",
                fontStyle: "italic",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              You do not have any posts yet.{" "}
              <Link to="/add" style={{ color: "#f4a261" }}>
                Create one now!
              </Link>
            </p>
          )}

          <div className="title">
            <h1>Saved List</h1>
          </div>

          {data.savedPosts && data.savedPosts.length > 0 ? (
            <List listData={data.savedPosts} />
          ) : (
            <p
              style={{
                color: "#555",
                fontStyle: "italic",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              You don’t have any saved posts yet.{" "}
              <Link to="/" style={{ color: "#f4a261" }}>
                Browse listings
              </Link>{" "}
              to find your favorites!
            </p>
          )}
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat chats={chats} />
        </div>
      </div>
    </div>
  );
}
