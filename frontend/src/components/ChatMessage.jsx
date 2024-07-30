import PropTypes from 'prop-types';
import '../styles/ChatMessage.css';

const ChatMessage = ({ message }) => {
  return (
    <div className="chat-message">
      <div className="message-sender">{message.sender}</div>
      <div className="message-content">{message.content}</div>
      <div className="message-timestamp">{new Date(message.timestamp).toLocaleTimeString()}</div>
    </div>
  );
};
ChatMessage.prototype = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};
export default ChatMessage;