import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState, useRef } from "react";

// Remove the constant key definitions from here
// We'll generate user-specific keys dynamically

export default function ChatInterface() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  // Generate user-specific storage keys
  const getChatsKey = () => `chatInterface_chats_${authUser?.uid}`;
  const getSelectedChatKey = () =>
    `chatInterface_selectedChatId_${authUser?.uid}`;

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0 && authUser) {
      localStorage.setItem(getChatsKey(), JSON.stringify(chats));
    }
  }, [chats, authUser]);

  // Save selected chat ID to localStorage whenever it changes
  useEffect(() => {
    if (selectedChatId && authUser) {
      localStorage.setItem(getSelectedChatKey(), selectedChatId);
    }
  }, [selectedChatId, authUser]);

  // Load chats and selected chat when user changes
  useEffect(() => {
    if (!authUser) {
      setChats([]);
      setSelectedChatId(undefined);
      return;
    }

    const savedChats = localStorage.getItem(getChatsKey());
    const savedSelectedChatId = localStorage.getItem(getSelectedChatKey());

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
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, [authUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const createNewChat = () => {
    if (!authUser) return;

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

  const renameChat = (chatId, newTitle) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const clearAllHistory = () => {
    if (authUser) {
      localStorage.removeItem(getChatsKey());
      localStorage.removeItem(getSelectedChatKey());
    }
    setChats([]);
    setSelectedChatId(undefined);
    createNewChat();
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (authUser) {
      if (updatedChats.length === 0) {
        localStorage.removeItem(getChatsKey());
        localStorage.removeItem(getSelectedChatKey());
      } else {
        localStorage.setItem(getChatsKey(), JSON.stringify(updatedChats));
      }
    }

    if (selectedChatId === chatId) {
      if (updatedChats.length > 0) {
        setSelectedChatId(updatedChats[0].id);
      } else {
        setSelectedChatId(undefined);
        createNewChat();
      }
    }
  };

  const sendToWebhook = async (message, response) => {
    try {
      await fetch("N8n Url", {
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
      const response = await fetch("N8n Url", {
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

        <div className="bg-gray-950 p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
