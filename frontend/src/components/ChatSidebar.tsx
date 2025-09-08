import { useState } from "react";

import {
  MessageSquare,
  Plus,
  Settings,
  Menu,
  Zap,
  TrendingUp,
  BookOpen,
  History,
  Trash2,
  Edit3,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId?: string | null;
  onSelectChat: (chatId: string) => void;
  onClearAllHistory: () => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ChatSidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClearAllHistory,
  onRenameChat,
  isCollapsed = false,
  onToggleCollapse,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRenameStart = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleRenameSave = () => {
    if (editingChatId && editTitle.trim()) {
      onRenameChat(editingChatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleRenameCancel = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen bg-chat-sidebar border-r border-border flex flex-col transition-all duration-300 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <button
              onClick={() => navigate("/")}
              className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              AI Chat
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="hover:bg-chat-sidebar-hover transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className="w-full mt-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground transition-all duration-200 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={onNewChat}
            className="w-full mt-2 hover:bg-chat-sidebar-hover"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="p-2 border-b border-border">
        <div className="space-y-1">
          <button
            onClick={() => navigate("/integrations")}
            className={`w-full justify-start hover:bg-chat-sidebar-hover transition-colors ${
              location.pathname === "/integrations"
                ? "bg-chat-sidebar-hover text-primary"
                : "text-foreground"
            } ${isCollapsed ? "px-2" : "px-3"}`}
          >
            <Zap className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Integrations</span>}
          </button>

          <button
            onClick={() => navigate("/boost")}
            className={`w-full justify-start hover:bg-chat-sidebar-hover transition-colors ${
              location.pathname === "/boost"
                ? "bg-chat-sidebar-hover text-primary"
                : "text-foreground"
            } ${isCollapsed ? "px-2" : "px-3"}`}
          >
            <TrendingUp className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Boost</span>}
          </button>

          <button
            onClick={() => navigate("/spellbooks")}
            className={`w-full justify-start hover:bg-chat-sidebar-hover transition-colors ${
              location.pathname === "/spellbooks"
                ? "bg-chat-sidebar-hover text-primary"
                : "text-foreground"
            } ${isCollapsed ? "px-2" : "px-3"}`}
          >
            <BookOpen className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Spellbooks</span>}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length > 0 && !isCollapsed && (
          <div className="pb-2 mb-2 border-b border-border">
            <button
              onClick={onClearAllHistory}
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start transition-colors"
            >
              <History className="h-4 w-4 mr-2" />
              Clear All History
            </button>
          </div>
        )}

        {!isCollapsed && chats.length > 0 && (
          <div className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">
            Recent Chats
          </div>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`relative group rounded-lg transition-all duration-200 mb-2 hover:bg-chat-sidebar-hover ${
              selectedChatId === chat.id
                ? "bg-chat-sidebar-hover border border-primary/20"
                : ""
            }`}
          >
            {editingChatId === chat.id ? (
              <div className="p-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 text-sm border border-border rounded-md bg-chat-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSave();
                    if (e.key === "Escape") handleRenameCancel();
                  }}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={handleRenameCancel}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenameSave}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onSelectChat(chat.id)}
                className="w-full p-3 text-left transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {chat.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {chat.timestamp}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            )}
            {!isCollapsed && editingChatId !== chat.id && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameStart(chat);
                  }}
                  className="h-6 w-6 p-0 hover:bg-primary/20 hover:text-primary"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => navigate("/settings")}
          className={`${
            isCollapsed ? "w-full" : "w-full"
          } hover:bg-chat-sidebar-hover justify-start transition-colors ${
            location.pathname === "/settings"
              ? "bg-chat-sidebar-hover text-primary"
              : "text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Settings</span>}
        </button>
      </div>
    </div>
  );
}
