import Markdown from "react-markdown";
import { Bot, User } from "lucide-react";

interface IMessageBubble {
  role: "user" | "assistant";
  content: string;
}

function MessageBubble({ role, content }: IMessageBubble) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-2.5 sm:gap-3.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-xs shadow-indigo-500/10 shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-indigo-400" />
        </div>
      )}

      <div
        className={`w-fit max-w-[88%] sm:max-w-[80%] md:max-w-[72%] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl wrap-break-word overflow-hidden text-sm sm:text-base leading-relaxed transition-all shadow-xs ${
          isUser
            ? "bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white rounded-tr-xs shadow-indigo-600/15 border border-indigo-500/20"
            : "bg-zinc-900/70 border border-zinc-800/80 text-zinc-100 rounded-tl-xs shadow-black/20 [&_p]:leading-relaxed [&_p:not(:last-child)]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_pre]:bg-zinc-950/90 [&_pre]:border [&_pre]:border-zinc-800/90 [&_pre]:rounded-xl [&_pre]:p-3 sm:[&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-3 [&_code]:font-mono [&_code]:text-xs sm:[&_code]:text-sm [&_code]:text-indigo-300 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-lg sm:[&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-zinc-100 [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-medium [&_h3]:text-zinc-200 [&_a]:text-indigo-400 [&_a]:underline hover:[&_a]:text-indigo-300"
        }`}
      >
        <Markdown>{content}</Markdown>
      </div>

      {isUser && (
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 shadow-xs shrink-0 mt-0.5">
          <User className="w-4 h-4 text-zinc-300" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
