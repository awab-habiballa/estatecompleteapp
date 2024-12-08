import { Link, useNavigate } from "react-router-dom";

import "./register.scss";
import { useState } from "react";
import apiRequest from "../../lib/apiRegues";

export default function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input
            name="username"
            required
            minLength={4}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input name="email" required type="text" placeholder="Email" />
          <input
            name="password"
            required
            minLength={8}
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Register</button>
          <Link to="/login">Do you have an account?</Link>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}
