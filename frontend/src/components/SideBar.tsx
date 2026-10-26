import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeft,
  PanelRight,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  setConversations,
  setSelectedConversation,
  type Conversation,
} from "@/redux/conversationSlice.ts";
import { setMessages } from "@/redux/messageSlice";
import getMessages from "@/features/getMessages";
import { setUserdata } from "@/redux/userSlice";
import { getConversations } from "@/features/getConversations";
import logOut from "@/features/logout";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);
  const { conversations, selectedConversation } = useAppSelector(
    (state) => state.conversation,
  );
  const { userData } = useAppSelector((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
    setMobileOpen(false);
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setMobileOpen(false);
    if (selectedConversation?._id === conv?._id) return;
    dispatch(setSelectedConversation(conv));
    const data = await getMessages(conv?._id);
    dispatch(setMessages(data || []));
  };

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, [dispatch, userData]);

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-zinc-800 py-4 gap-2 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight size={18} />
        </button>

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          onClick={handleNewChat}
        >
          <Plus size={18} />
        </button>

        <div className="flex-1 w-full overflow-y-auto px-2 pt-4 space-y-1">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv?._id;
            return (
              <div
                key={conv?._id}
                onClick={() => handleSelectConversation(conv)}
                className={`flex items-center justify-center w-full h-9 rounded-lg cursor-pointer transition ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <MessageSquare size={16} />
              </div>
            );
          })}
        </div>

        <div className="relative shrink-0">
          {userData?.avatar && !imageError ? (
            <img
              className="w-9 h-9 rounded-lg object-cover border border-indigo-500/30"
              src={userData?.avatar}
              alt="Avatar"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User size={16} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-3 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={16} />
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen shrink-0 bg-[#0d0f14] border-r border-zinc-800 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
            <button
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeft size={18} />
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-base font-semibold text-white tracking-tight flex-1">
              CortexAI
            </span>

            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              free
            </span>

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              onClick={handleNewChat}
            >
              <PenSquare size={16} />
            </button>
          </div>

          <div className="p-3">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg py-2.5 transition cursor-pointer"
              onClick={handleNewChat}
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {conversations.length === 0 ? "No Recent Conversations" : "Recents"}
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {conversations?.map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;
              return (
                <div
                  key={conv?._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
                    isActive
                      ? "bg-indigo-600/15 text-white border border-indigo-500/30"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white border border-transparent"
                  }`}
                >
                  <MessageSquare
                    size={16}
                    className={`shrink-0 ${
                      isActive ? "text-indigo-400" : "text-zinc-500"
                    }`}
                  />
                  <span className="truncate">{conv?.title || "New Chat"}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-zinc-800">
            {userData ? (
              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-800/60 transition">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30"
                      src={userData?.avatar}
                      alt="Avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">free plan</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex items-center justify-center w-7 h-7 rounded text-yellow-500 hover:bg-zinc-800 transition cursor-pointer">
                    <Coins size={16} />
                  </button>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
                    onClick={() => {
                      logOut();
                      dispatch(setUserdata(null));
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2.5 transition cursor-pointer">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
