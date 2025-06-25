import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    pinMessage,
  } = useChatStore();

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showPinned, setShowPinned] = useState(true);
  const [typingUserId, setTypingUserId] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        setTypingUserId(senderId);
        setTimeout(() => setTypingUserId(null), 3000); // clear after 3 seconds
      }
    });

    return () => {
      socket.off("typing");
    };
  }, [socket, selectedUser._id]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  const pinnedMessages = messages.filter((msg) => msg.pinned);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {pinnedMessages.length > 0 && (
        <div className="p-2 border-b border-base-300 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-yellow-500">
            📌 Pinned Messages
          </h4>
          <button
            onClick={() => setShowPinned(!showPinned)}
            className="text-xs text-blue-500 hover:underline"
          >
            {showPinned ? "Hide" : "Show"}
          </button>
        </div>
      )}

      {showPinned && pinnedMessages.length > 0 && (
        <div className="bg-base-200 p-3 space-y-4">
          {pinnedMessages.map((msg) => (
            <div
              key={msg._id + "-pin"}
              className="bg-base-100 p-3 rounded-lg shadow-md"
            >
              <div className="text-xs text-gray-500 mb-1">
                {formatMessageTime(msg.createdAt)}
              </div>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="max-w-[200px] rounded mb-2"
                />
              )}
              {msg.text && <p className="text-orange-300">{msg.text}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 flex items-center gap-2">
                <time className="text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>

                <motion.button
                  whileTap={{ scale: 0.8, rotate: 30 }}
                  onClick={() => {
                    pinMessage(message._id);
                    toast.success(
                      message.pinned ? "Message unpinned" : "Message pinned"
                    );
                  }}
                  title={message.pinned ? "Unpin message" : "Pin message"}
                  className={`transition-all text-sm ${
                    message.pinned
                      ? "text-yellow-500 rotate-45"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                >
                  📌
                </motion.button>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && (
                  <p className="text-orange-300 whitespace-pre-line">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {typingUserId === selectedUser._id && (
        <div className="px-4 pb-2 flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt="typing avatar"
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div className="typing-indicator flex items-center gap-1">
            <span className="dot bg-zinc-400"></span>
            <span className="dot bg-zinc-400"></span>
            <span className="dot bg-zinc-400"></span>
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
