import React, { useState, useEffect } from "react";
import api from "../api/client";
import { Mail, Check, Trash2, AlertCircle, Eye, EyeOff, Clock, User, X } from "lucide-react";

export const MessagesInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' or 'unread'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/contact/messages");
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setNotification({ type: "error", text: "Failed to load messages from inbox." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg) => {
    const newStatus = !msg.is_read;
    try {
      await api.put(`/api/contact/messages/${msg.id}/read`, { is_read: newStatus });
      fetchMessages();
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: newStatus });
      }
    } catch (err) {
      console.error("Toggle read status error:", err);
      setNotification({ type: "error", text: "Failed to update read status." });
    }
  };

  const handleDelete = async (id, senderName) => {
    if (!window.confirm(`Delete message from '${senderName}'?`)) return;
    try {
      await api.delete(`/api/contact/messages/${id}`);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      setNotification({ type: "success", text: "Message deleted from inbox." });
    } catch (err) {
      console.error("Delete message error:", err);
      setNotification({ type: "error", text: "Failed to delete message." });
    }
  };

  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    // If opening an unread message, mark it as read automatically
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inquiries & Contact Inbox</h2>
          <p className="text-sm text-slate-500 mt-1">
            Review and respond to messages submitted by visitors on your public portfolio.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            {unreadCount} Unread Message{unreadCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification.text && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "unread" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Messages Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading inbox...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No inquiries in this folder. Your inbox is clean!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessageModal(msg)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  !msg.is_read ? "bg-indigo-50/40 hover:bg-indigo-50/70" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      !msg.is_read ? "bg-indigo-600" : "bg-transparent"
                    }`}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!msg.is_read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium truncate mt-0.5">
                      {msg.subject || "No subject"}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-slate-400 font-mono">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(msg);
                    }}
                    title={msg.is_read ? "Mark as unread" : "Mark as read"}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                  >
                    {msg.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id, msg.name);
                    }}
                    title="Delete inquiry"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedMessage.subject || "Contact Message"}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 flex justify-between">
                <span>Received: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : "Recently"}</span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Portfolio Inquiry")}`}
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Reply via Email →
                </a>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Message Content
                </label>
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Portfolio Inquiry")}`}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
              >
                Reply to {selectedMessage.name}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
