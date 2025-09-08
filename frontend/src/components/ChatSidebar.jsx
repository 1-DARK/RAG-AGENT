import { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Settings,
  Menu,
  Zap,
  TrendingUp,
  BookOpen,
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { logout, authUser } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 1024 && !isCollapsed) {
        onToggleCollapse();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed, onToggleCollapse]);

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

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-full bg- border-r border-gray-800 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h1 className="text-lg font-semibold ">AI Chat</h1>}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:text-green-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className={`mt-4 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors ${
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
      <div className="p-2 border-b border-gray-800">
        <div className="space-y-1">
          {[
            { path: "/integrations", icon: Zap, label: "Integrations" },
            { path: "/boost", icon: TrendingUp, label: "Boost" },
            { path: "/spellbooks", icon: BookOpen, label: "Spellbooks" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-2 rounded-md  hover:bg-gray-700 transition-colors $
            
             ${isCollapsed ? "justify-center " : ""}`}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto ">
        {!isCollapsed && chats.length > 0 && (
          <div className="p-3 border-b border-gray-800 flex justify-between items-center  hover:text-red-400">
            <span className="text-xs font-medium uppercase tracking-wider">
              Recent Chats
            </span>
            <button
              onClick={onClearAllHistory}
              className="text-xstransition-colors flex items-center"
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
                selectedChatId === chat.id ? "bg-gray-900" : "bg-black"
              }`}
            >
              {editingChatId === chat.id ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 text-sm border rounded-md b focus:outline-none focus:ring-2 "
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSave();
                      if (e.key === "Escape") handleRenameCancel();
                    }}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleRenameCancel}
                      className="px-2 py-1 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRenameSave}
                      className="px-2 py-1 text-xs text-white rounded"
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
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 " />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium  truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs truncate mt-1">
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
                    className="p-1 rounded  hover:text-green-400"
                  >
                    <Edit3 className="h-3 w-3 " />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="p-1 rounded hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Section */}
      {authUser && (
        <div className="p-3 border-t border-gray-800  space-y-2">
          <Link
            to={"/profile"}
            className={`flex items-center w-full p-2 rounded-md transition-colors  ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <User className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Profile</span>}
          </Link>

          <button
            onClick={logout}
            className={`flex items-center w-full p-2 rounded-md transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => navigate("/settings")}
          className={`flex items-center w-full p-2 rounded-md transition-colors $
           ${isCollapsed ? "justify-center" : ""}`}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </button>
      </div>
    </div>
  );
}
