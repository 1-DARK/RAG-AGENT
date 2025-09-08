import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() && !disabled && !isLoading) {
      setIsLoading(true);
      await onSendMessage(message.trim());
      setMessage("");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-600 ">
      <div className="flex gap-2 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="w-full  h-15 p-4 resize-none border border-gray-300 rounded-lg focus:ring-2  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={2}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          className="flex-shrink-0 h-[60px] w-[60px] flex items-center justify-center bg-black text-white rounded-lg  transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {disabled && (
        <p className="text-sm text-red-600 mt-2 text-center">
          Message sending is disabled due to limit reached.
        </p>
      )}
    </div>
  );
}
