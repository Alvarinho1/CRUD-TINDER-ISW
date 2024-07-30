import PropTypes from 'prop-types';
import '../styles/ChatInput.css';

const ChatInput = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <div className="chat-input">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

ChatInput.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
};

export default ChatInput;