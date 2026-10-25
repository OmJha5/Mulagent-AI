import { useAppSelector } from "@/redux/store";
import { MessageSquare } from "lucide-react";

function Nav() {
  const { selectedConversation } = useAppSelector(
    (state) => state.conversation,
  );
  const { messages } = useAppSelector((state) => state.messages);
  return (
    <>
      {selectedConversation && (
        <header className="h-14 sm:h-16 flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-zinc-800/80 bg-[#0d0f14]/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/25 shadow-xs shadow-indigo-500/10 shrink-0">
              <MessageSquare size={14} className="text-indigo-400" />
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight truncate max-w-44 sm:max-w-xs md:max-w-md lg:max-w-lg">
              {selectedConversation?.title || "New Chat"}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2.5 py-1 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{messages?.length || 0} messages</span>
            </div>
          </div>
        </header>
      )}
    </>
  );
}

export default Nav;
