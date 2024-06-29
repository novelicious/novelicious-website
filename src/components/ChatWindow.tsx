import axios from "axios";
import React, { useState } from "react";
import { FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import nulitas from "/novelicious.png";

interface ChatProps {
  sender: boolean;
  msg: string;
}
interface ChatWindowProps {
  book_reference: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ book_reference }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<ChatProps>({ sender: true, msg: "" });
  const [messages, setMessages] = useState<ChatProps[]>([]);
  const [loading, setLoading] = useState(false);

  function onSend(sentMessage: string) {
    setLoading(true);
    axios
      .post(`https://novelity.koyeb.app/bot/ask`, null, {
        params: {
          prompt: sentMessage,
          chapter_ref: book_reference,
        },
      })
      .then((res) => {
        const data = res.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          { msg: data, sender: false },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  const handleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage({ sender: true, msg: "" });
    onSend(message.msg);
  };

  const messagesElement = () => {
    return (
      <div className="space-y-4">
        {messages.map((chat, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              chat.sender
                ? "bg-primary text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {chat.msg}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${
        isOpen ? "w-80 h-96" : "w-12 h-12"
      } transition-all duration-300 bg-white shadow-lg rounded-lg overflow-hidden z-50`}
    >
      <div
        className="bg-primary p-1 cursor-pointer flex items-center justify-center"
        onClick={handleOpenClose}
      >
        {isOpen ? (
          <FaChevronDown className="text-white" />
        ) : (
          <div className="flex flex-col items-center">
            {/* <FaChevronUp className="text-white" /> */}
            <RiMessage2Fill className="text-white rotate-[-2deg]" />
            <img src={nulitas} className="  object-fill" />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
            {messagesElement()}
          </div>
          <div className="p-4 border-t flex items-center">
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                disabled={loading}
                type="text"
                className="w-full p-2 mb-8 border-2 rounded border-primary"
                placeholder={
                  loading ? "Awaiting Response..." : "Type your message..."
                }
                value={message.msg}
                onChange={(e) =>
                  setMessage({ sender: true, msg: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="bg-primary p-2 mb-8 rounded-r text-white"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
