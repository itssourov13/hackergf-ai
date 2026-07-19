import React from "react";
import { Link } from "react-router-dom";
import { Plus, MessageSquare, Trash2, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatSidebar({ chats, chatId, createNewChat, deleteChat, onNavigate, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-600/10 border border-red-600/30">
            <Terminal className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-bold text-white text-sm">Hacker <span className="text-red-500">gf</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={createNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 hover:border-red-600/50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-600">No conversations yet</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onNavigate(`/chat/${chat.id}`)}
              className={cn(
                "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                chatId === chat.id
                  ? "bg-zinc-800/80 text-white"
                  : "hover:bg-zinc-900 text-zinc-400"
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
              <span className="flex-1 text-sm truncate">{chat.title}</span>
              <button
                type="button"
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-60 md:opacity-0 md:group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}