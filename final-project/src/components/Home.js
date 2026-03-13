import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Welcome {user?.username}</h2>
      <p>You are logged in!</p>
    </div>
  );
};

export default Home;