import { useAppSelector } from "@/redux/store";
import MessageBubble from "@/components/MessageBubble";
import type { IMessage } from "@/redux/messageSlice";
import { Sparkles } from "lucide-react";

function MessageList() {
  const { selectedConversation } = useAppSelector(
    (state) => state.conversation,
  );
  const { messages } = useAppSelector((state) => state.messages);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        {messages.length === 0 || !selectedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-indigo-500/20 via-violet-500/10 to-transparent border border-indigo-500/20 shadow-lg shadow-indigo-500/5 mb-4 sm:mb-5">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            </div>

            <div className="flex flex-col items-center gap-2 max-w-md mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                MulAgent
              </h1>
              <p className="text-base sm:text-lg font-medium text-zinc-400">
                How can I assist you today?
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-sm">
                Ask anything — write code, brainstorm ideas, analyze concepts, or solve complex problems.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {[
                "Write a Netflix clone",
                "Explain Redis",
                "Build a dashboard",
              ].map((initialSuggestion, idx) => (
                <button
                  key={idx}
                  className="text-xs sm:text-sm text-zinc-300 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-indigo-500/30 px-3.5 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-xs cursor-pointer"
                >
                  {initialSuggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-7">
            {messages.map((msg: IMessage, ind: number) => (
              <div key={ind}>
                <MessageBubble role={msg?.role} content={msg?.content} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageList;
