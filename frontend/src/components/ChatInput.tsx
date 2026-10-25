import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import sendPrompt from "@/features/sendPrompt";
import { addMessage } from "@/redux/messageSlice";

function ChatInput() {
  const [value, setValue] = useState("");
  const { selectedConversation } = useAppSelector(
    (state) => state.conversation,
  );
  const dispatch = useAppDispatch();

  const handleSendPrompt = async () => {
    if (!selectedConversation) return;

    dispatch(addMessage({ role: "user", content: value }));
    setValue("");
    const data = await sendPrompt({
      prompt: value,
      conversationId: selectedConversation?._id,
    });
    dispatch(addMessage({ role: "assistant", content: data }));
  };

  return (
    <footer className="w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#0d0f14]/80 backdrop-blur-md border-t border-zinc-800/80">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-1.5">
        <div className="flex flex-col gap-2 bg-zinc-900/60 hover:bg-zinc-900/80 focus-within:bg-zinc-900/90 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/15 border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-lg shadow-black/20 transition-all duration-200">
          <textarea
            placeholder="Ask anything..."
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (value.trim()) handleSendPrompt();
              }
            }}
            value={value}
            className="w-full bg-transparent outline-none resize-none text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-12"
            rows={2}
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors duration-150 cursor-pointer"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors duration-150 cursor-pointer"
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={!value.trim()}
              onClick={handleSendPrompt}
              className={`flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl transition-all duration-200 ${
                value.trim()
                  ? "bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-md shadow-indigo-600/25 active:scale-95 cursor-pointer"
                  : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] sm:text-xs text-zinc-600 select-none">
          MulAgent may produce inaccurate information. Verify important details.
        </p>
      </div>
    </footer>
  );
}

export default ChatInput;
