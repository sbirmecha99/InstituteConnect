import { useState } from "react";

const EditProfile = () => {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    await fetch("/api/update-profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${yourToken}`,
      },
      body: formData,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;
