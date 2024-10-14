import React, { useState, useEffect } from 'react';

const Profile = ({ token }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://127.0.0.1:5000/auth/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData(data);
      } else {
        alert('Unable to fetch profile');
      }
    };

    fetchProfile();
  }, [token]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {profileData.message}</h2>
    </div>
  );
};

export default Profile;
