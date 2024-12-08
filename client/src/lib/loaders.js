import { defer } from "react-router-dom";
import apiRequest from "./apiRegues";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest.get(`/posts/${params.id}`);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];

  const postPromise = await apiRequest.get(`/posts?${query}`);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const res = await apiRequest.get("/users/profilePosts");
  const chatRes = await apiRequest.get("/chats");

  return [res.data, chatRes.data];
};
