import api from "./api";

// ======================================
// Get All Users
// ======================================

export const getAllUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

// ======================================
// Search Users
// ======================================

export const searchUsers = async (keyword) => {
  const response = await api.get(`/users/search?keyword=${keyword}`);

  return response.data;
};

// ======================================
// Get User Profile
// ======================================

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);

  return response.data;
};

// ======================================
// Update Profile
// ======================================

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);

  return response.data;
};

// ======================================
// Update Avatar
// ======================================

export const updateAvatar = async (avatar) => {
  const response = await api.put("/users/avatar", {
    avatar,
  });

  return response.data;
};
