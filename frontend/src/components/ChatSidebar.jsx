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
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User } from "lucide-react";

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
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRenameStart = (chat) => {
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
  const { logout, authUser } = useAuthStore();
  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-full bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-white">AI Chat</h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className={`mt-12  bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${
            isCollapsed
              ? "p-2 flex justify-center"
              : "py-2 px-3 flex items-center justify-center w-full"
          }`}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Chat</span>}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="p-2 border-b border-gray-700">
        <div className="space-y-1">
          {[
            { path: "/integrations", icon: Zap, label: "Integrations" },
            { path: "/boost", icon: TrendingUp, label: "Boost" },
            { path: "/spellbooks", icon: BookOpen, label: "Spellbooks" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && chats.length > 0 && (
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Recent Chats
            </span>
            <button
              onClick={onClearAllHistory}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>
        )}

        <div className="p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`relative rounded-md transition-colors mb-1 group ${
                selectedChatId === chat.id ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              {editingChatId === chat.id ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSave();
                      if (e.key === "Escape") handleRenameCancel();
                    }}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleRenameCancel}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRenameSave}
                      className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full p-2 text-left transition-colors rounded-md ${
                    isCollapsed
                      ? "flex justify-center"
                      : "flex items-start gap-2"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  )}
                </button>
              )}
              {!isCollapsed && editingChatId !== chat.id && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameStart(chat);
                    }}
                    className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {authUser && (
        <>
          <Link to={"/profile"} className={`btn btn-sm gap-2`}>
            <User className="size-5" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button className="flex gap-2 items-center" onClick={logout}>
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => navigate("/settings")}
          className={`flex items-center w-full p-2 rounded-md transition-colors ${
            location.pathname === "/settings"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          } ${isCollapsed ? "justify-center" : ""}`}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </button>
      </div>
    </div>
  );
}
