/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, MessageCircle, X, User as UserIcon } from "lucide-react";
import { getMessagesService, sendMessageService } from "../../services/messageService";
import { extractChatTime } from "../../utils/utils";
import { useSocketContext } from "../../context/SocketContext";
import Avatar from "../ui/Avatar";

const Chat = ({ isOpen, setIsOpen, isEmployee, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChange, setIsChange] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (isOpen && isEmployee) {
        const response = await getMessagesService(
          receiver._id,
          localStorage.getItem("employee_access_token")
        );
        setMessages(response.messages);
      }
      if (isOpen && !isEmployee) {
        const response = await getMessagesService(
          receiver._id,
          localStorage.getItem("access_token")
        );
        setMessages(response.messages);
      }
    };
    fetchMessages();
  }, [receiver, isOpen, isEmployee, isChange]);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [isChange]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const data = {
      receiverId: receiver._id,
      message: input,
      token: isEmployee
        ? localStorage.getItem("employee_access_token")
        : localStorage.getItem("access_token"),
    };
    const response = await sendMessageService(data);
    if (response.status == 200) {
      setInput("");
      setIsChange(!isChange);
    }
  };
  const { socket } = useSocketContext();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setIsChange(!isChange);
    });
    return () => socket?.off("newMessage");
  }, [socket, isChange]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && !isEmployee && (
        <motion.button
          onClick={togglePopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-white shadow-elevated"
        >
          <MessageCircle size={22} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-elevated"
          >
            <div className="flex items-center justify-between gradient-brand p-4 text-white">
              <div className="flex items-center gap-2.5">
                <Avatar name={receiver?.name} size="sm" />
                <h2 className="text-sm font-semibold">{receiver?.name}</h2>
              </div>
              <button onClick={togglePopup} className="rounded-full p-1 transition-colors hover:bg-white/20">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map((item) => (
                  <div
                    key={item._id}
                    ref={lastMessageRef}
                    className={`w-fit max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      item.sender !== receiver._id ? "ml-auto bg-primary text-white" : "bg-slate-100 text-fg"
                    }`}
                  >
                    <div>{item.message}</div>
                    <div className={`mt-0.5 text-[10px] ${item.sender !== receiver._id ? "text-white/70" : "text-fg-subtle"}`}>
                      {extractChatTime(item.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-fg-muted">
                  <UserIcon size={22} className="text-fg-subtle" />
                  No messages yet
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 p-3">
              <input
                type="text"
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary-50"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-700"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
