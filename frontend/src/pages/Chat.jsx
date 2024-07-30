import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import "../styles/Chat.css";
import { getChats } from '../services/chat.service.js';

const Chat = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('usuario')).email;
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessages] = useState([]);

  const getMatches = async () => {
    try {
      const {data} = await getChats(storedUser);
      setMatches(data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const getMessages = async () => {
    try {
      const formattedData = await getChats(storedUser);
      setMessages(formattedData);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  useEffect(() => {
    //getMessages();
    getMatches();
  }, []);

  const onClickUser = (id) =>{
    console.log("Aqui se deberian cargar los mensajes para determinado usuario" + id )
  }

  return (
    <div className="chat-page">
      <Navbar />
      <div className="window">
        <aside className="conv-list-view">
          <header className="conv-list-view__header">
            <div className="cf"></div>
          </header>
          <ul className="conv-list">
            {matches &&
              matches.
              filter(x=>x).map(function (item, i) {
                return (
                   item && <li key={i} onClick={()=> onClickUser(item[0]._id)}>
                    <div className="status">
                      <i className="status__indicator--unread-message"></i>
                      <figure className="status__avatar">
                        <img src="http://1.gravatar.com/avatar/7ec0cac01b6d505b2bbb2951a722e202?size=80" />
                      </figure>
                      <div className="meta">
                        <div className="meta__name">{item[0].nombre + " " + item[0].apellidos}</div>
                        <div className="meta__sub--dark"></div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </aside>
        <section className="chat-view">
          <header className="chat-view__header">
            <div className="cf">
              <div className="status">
                <i className="status__indicator--online"></i>
                <div className="meta">
                  <div className="meta__name">Tim Pietrusky</div>
                  <div className="meta__sub--light">Adium that ass!</div>
                </div>
              </div>
              <ul className="function-list">
                <li className="icon-cloud"></li>
                <li className="icon-clock"></li>
                <li className="icon-dots"></li>
              </ul>
            </div>
          </header>
          <section className="message-view">
            {messages &&
              messages.filter(x=>x).map(function (item, i) {
                return (
                  <div key={i}>
                    <div className="cf"></div>
                    <div className="message">
                      <figure className="message__avatar">
                        <img src="http://1.gravatar.com/avatar/34735b367f6bf8d5d2f38cb3d20d5e36?size=80" />
                      </figure>
                      <div className="message__bubble">
                        {" "}
                        REEMPLAZAR POR MENSAJE EN BD
                      </div>
                    </div>{" "}
                  </div>
                );
              })}
            <div className="cf"></div>
            <div className="message">
              <figure className="message__avatar">
                <img src="http://1.gravatar.com/avatar/34735b367f6bf8d5d2f38cb3d20d5e36?size=80" />
              </figure>
              <div className="message__bubble">
                {" "}
                REEMPLAZAR POR MENSAJE EN BD
              </div>
            </div>{" "}
            <div className="cf"></div>
            <div className="message--send">
              <div className="message__bubble--send">MOCK</div>
              <figure className="message__avatar">
                <img src="http://1.gravatar.com/avatar/89b9501f0f9e3020aab173f9a5a47683?size=80" />
              </figure>
            </div>
          </section>
          <footer className="chat-view__input">
            <div className="input">
              <input value={newMessage} />
              <span className="input__emoticon"></span>
            </div>
            <div className="status">
              <figure className="status__avatar--small">
                <img src="http://1.gravatar.com/avatar/89b9501f0f9e3020aab173f9a5a47683?size=80" />
              </figure>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Chat;
