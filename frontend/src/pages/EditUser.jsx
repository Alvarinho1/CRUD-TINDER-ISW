import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


const EditUser = ({ user }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  const handleSave = () => {
    // Save user details
  };

  return (
    <div className="edit-user">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

EditUser.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditUser;