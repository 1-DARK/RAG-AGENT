import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() && !disabled && !isLoading) {
      setIsLoading(true);
      onSendMessage(message.trim());
      setMessage("");

      // Simulate a brief delay for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 border-t border-border bg-chat-background/50 backdrop-blur-sm">
      <div className="flex gap-4 items-end max-w-4xl mx-auto">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={`min-h-[60px] max-h-[120px] resize-none bg-chat-input border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            rows={2}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed h-[60px] px-6"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {disabled && (
        <p className="text-sm text-destructive mt-2 text-center">
          Message sending is disabled due to limit reached.
        </p>
      )}
    </div>
  );
}
