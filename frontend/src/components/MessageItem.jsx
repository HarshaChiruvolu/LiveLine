<div
  className={`chat ${
    message.senderId === authUser._id ? "chat-end" : "chat-start"
  }`}
>
  <div className="chat-header">
    <span>{message.sender?.fullName || "User"}</span>

    {/* Pin icon shown only if not already pinned */}
    {!message.pinned && (
      <button
        onClick={() => useChatStore.getState().pinMessage(message._id)}
        className="ml-2 text-gray-500 hover:text-yellow-500"
        title="Pin message"
      >
        📌
      </button>
    )}

    {/* Pinned label */}
    {message.pinned && (
      <span className="ml-2 text-yellow-500 font-medium">📌 Pinned</span>
    )}
  </div>

  <div className="chat-bubble">{message.text}</div>
</div>;
