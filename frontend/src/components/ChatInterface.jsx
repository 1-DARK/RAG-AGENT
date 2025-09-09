import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState, useRef } from "react";

const CHATS_STORAGE_KEY = "chatInterface_chats";
const SELECTED_CHAT_KEY = "chatInterface_selectedChatId";

export default function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const messagesEndRef = useRef(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Count user messages across all chats
  const totalUserMessages = chats.reduce((total, chat) => {
    return total + chat.messages.filter((msg) => msg.sender === "user").length;
  }, 0);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);

  const renameChat = (chatId, newTitle) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Save selected chat ID to localStorage whenever it changes
  useEffect(() => {
    if (selectedChatId) {
      localStorage.setItem(SELECTED_CHAT_KEY, selectedChatId);
    }
  }, [selectedChatId]);

  // Load chats and selected chat from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    const savedSelectedChatId = localStorage.getItem(SELECTED_CHAT_KEY);

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);

        if (
          savedSelectedChatId &&
          parsedChats.some((chat) => chat.id === savedSelectedChatId)
        ) {
          setSelectedChatId(savedSelectedChatId);
        } else if (parsedChats.length > 0) {
          setSelectedChatId(parsedChats[0].id);
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newChatId);
  };

  const clearAllHistory = () => {
    setChats([]);
    setSelectedChatId(undefined);
    localStorage.removeItem(CHATS_STORAGE_KEY);
    localStorage.removeItem(SELECTED_CHAT_KEY);

    // Create a new chat after clearing
    setTimeout(() => createNewChat(), 100);
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (updatedChats.length === 0) {
      localStorage.removeItem(CHATS_STORAGE_KEY);
      localStorage.removeItem(SELECTED_CHAT_KEY);
    } else {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    }

    if (selectedChatId === chatId) {
      if (updatedChats.length > 0) {
        setSelectedChatId(updatedChats[0].id);
      } else {
        setSelectedChatId(undefined);
        setTimeout(() => createNewChat(), 100);
      }
    }
  };

  const sendToWebhook = async (message, response) => {
    try {
      await fetch("http://localhost:5678/webhook/webi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
          assistantResponse: response,
          timestamp: new Date().toISOString(),
          chatId: selectedChatId,
        }),
      });
    } catch (error) {
      console.error("Failed to send to webhook:", error);
    }
  };

  const getAssistantResponse = async (message) => {
    try {
      const response = await fetch("http://localhost:5678/webhook/webi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          chatId: selectedChatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);
        return (
          data.output ||
          data.response ||
          data.message ||
          data.answer ||
          responseText
        );
      } catch {
        return responseText;
      }
    } catch (error) {
      console.error("Failed to get response from n8n:", error);
      return "Sorry, I couldn't process your request at the moment.";
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChatId) {
      createNewChat();
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastMessage: content,
              timestamp: userMessage.timestamp,
              title:
                chat.title === "New Chat"
                  ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                  : chat.title,
            }
          : chat
      )
    );

    setIsLoading(true);

    try {
      const assistantResponse = await getAssistantResponse(content);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                lastMessage: assistantResponse.slice(0, 50) + "...",
                timestamp: assistantMessage.timestamp,
              }
            : chat
        )
      );

      sendToWebhook(content, assistantResponse);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onClearAllHistory={clearAllHistory}
        onRenameChat={renameChat}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col">
        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto bg-gray-950/80">
          {selectedChat && selectedChat.messages.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {selectedChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 p-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                  </div>
                  <div className="bg-transparent text-gray-200">
                    <p className="text-sm text-gray-400">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center ">
              <div className="text-center max-w-2xl mx-auto p-8">
                <h1 className="text-4xl font-bold text-gray-200 mb-4">
                  Hi, {authUser?.fullName}
                </h1>
                <p className="text-4xl text-gray-400 mb-8">
                  What can I help you with ?
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-gray-950 p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
