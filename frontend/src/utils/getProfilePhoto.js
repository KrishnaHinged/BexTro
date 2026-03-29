// utils/getProfilePhoto.js
export const getProfilePhoto = (photo, username) => {
  if (!photo) {
    return `https://ui-avatars.com/api/?name=${username}`;
  }

  // if already full URL
  if (photo.startsWith("http")) return photo;

  // if stored path
  return `http://localhost:5005${photo}`;
};