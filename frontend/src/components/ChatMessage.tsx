import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 p-6 ${
      message.sender === 'user' ? 'justify-end' : ''
    }`}>
      {message.sender === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={`max-w-2xl ${
        message.sender === 'user' 
          ? 'bg-chat-message-user text-primary-foreground rounded-2xl px-4 py-3' 
          : 'bg-transparent text-foreground'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p className={`text-xs mt-2 ${
          message.sender === 'user' 
            ? 'text-primary-foreground/70' 
            : 'text-muted-foreground'
        }`}>
          {message.timestamp}
        </p>
      </div>
      
      {message.sender === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}