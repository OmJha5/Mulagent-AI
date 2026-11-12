import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, Check, Code2, Copy, ExternalLink, User, X } from "lucide-react";
import { messageRole, type MessageRole } from "@/constants/constants";
import { setArtifacts, type IArtifact } from "@/redux/messageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

interface IMessageBubble {
  role: MessageRole;
  content: string;
  images?: string[];
  artifacts?: IArtifact[];
}

function MessageBubble({
  role,
  content,
  images = [],
  artifacts = [],
}: IMessageBubble) {
  const isUser = role === messageRole.user;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [lightBox, setLightBox] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { artifacts: activeArtifacts } = useAppSelector(
    (state) => state.messages,
  );
  const primaryArtifact = artifacts[0];
  const isArtifactSelected =
    Boolean(primaryArtifact) && activeArtifacts[0]?.id === primaryArtifact?.id;

  const copyCode = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCode(value);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  useEffect(() => {
    if (!lightBox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightBox(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightBox]);

  return (
    <>
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
          className={`w-fit min-w-0 px-4 mb-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl wrap-break-word overflow-hidden text-sm sm:text-base leading-relaxed transition-all shadow-xs ${
            isUser
              ? "max-w-[88%] sm:max-w-[80%] md:max-w-[72%] bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white rounded-tr-xs shadow-indigo-600/15 border border-indigo-500/20"
              : "max-w-full bg-zinc-900/70 border border-zinc-800/80 text-zinc-100 rounded-tl-xs shadow-black/20"
          }`}
        >
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img: string, ind: number) => (
                <img
                  key={ind}
                  src={img}
                  alt=""
                  onClick={() => setLightBox(img)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                />
              ))}
            </div>
          )}

          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-5 mb-3">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 last:mb-0 whitespace-pre-wrap wrap-break-word">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-indigo-500 pl-4 italic my-3 text-zinc-300">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-6 border-white/10" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-white/10">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-white/10 px-3 py-2">{children}</td>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 underline inline-flex items-center gap-1 hover:text-indigo-300 transition-colors"
                >
                  {children}
                  <ExternalLink size={14} />
                </a>
              ),
              pre: ({ children }) => <>{children}</>,
              code: ({ className, children }) => {
                const raw = String(children ?? "");
                const value = raw.trim();
                const isBlock = Boolean(className) || raw.includes("\n");

                if (!isBlock) {
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-200 font-mono text-xs sm:text-sm">
                      {value}
                    </code>
                  );
                }

                const language = className
                  ? className.replace("language-", "")
                  : "text";

                return (
                  <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                    <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                      <span className="uppercase text-xs text-slate-400">
                        {language}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                        onClick={() => copyCode(value)}
                      >
                        {copiedCode === value ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      wrapLongLines
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        padding: "16px",
                        background: "#0d1117",
                        fontSize: "13px",
                      }}
                    >
                      {value}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              img: ({ src, alt }) => {
                if (!src) return null;
                return (
                  <img
                    src={src}
                    alt={alt || ""}
                    onClick={() => setLightBox(src)}
                    loading="lazy"
                    onError={(e) => e.currentTarget.remove()}
                    className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                  />
                );
              },
            }}
          >
            {content}
          </Markdown>

          {!isUser && primaryArtifact && (
            <button
              type="button"
              onClick={() => dispatch(setArtifacts(artifacts))}
              className={`mt-3 w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition cursor-pointer ${
                isArtifactSelected
                  ? "bg-indigo-500/15 border-indigo-500/40 text-zinc-100"
                  : "bg-zinc-950/60 border-zinc-800 hover:border-indigo-500/30 hover:bg-zinc-900/90 text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 shrink-0">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {primaryArtifact.title || "Generated Project"}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {primaryArtifact.files?.length ?? 0}{" "}
                    {primaryArtifact.files?.length === 1 ? "file" : "files"}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg shrink-0 ${
                  isArtifactSelected
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {isArtifactSelected ? "Viewing" : "Open"}
              </span>
            </button>
          )}
        </div>

        {isUser && (
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 shadow-xs shrink-0 mt-0.5">
            <User className="w-4 h-4 text-zinc-300" />
          </div>
        )}
      </div>

      {lightBox && (
        <div
          onClick={() => setLightBox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <button
            type="button"
            onClick={() => setLightBox(null)}
            aria-label="Close image preview"
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
          <img
            src={lightBox}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-xl object-contain border border-white/10 shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export default MessageBubble;
