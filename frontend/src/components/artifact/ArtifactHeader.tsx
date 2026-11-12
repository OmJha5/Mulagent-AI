import { Check, Code2, Copy, Eye, PanelRightClose } from "lucide-react";
import { artifactTab, type ArtifactTab } from "@/constants/constants";

interface ArtifactHeaderProps {
  title: string;
  copied: boolean;
  canCopy: boolean;
  canPreview: boolean;
  activeTab: ArtifactTab;
  onCollapse: () => void;
  onCopy: () => void;
  onTabChange: (tab: ArtifactTab) => void;
}

function ArtifactHeader({
  title,
  copied,
  canCopy,
  canPreview,
  activeTab,
  onCollapse,
  onCopy,
  onTabChange,
}: ArtifactHeaderProps) {
  return (
    <header className="h-14 sm:h-16 px-3 sm:px-4 border-b border-zinc-800/80 flex items-center gap-2 sm:gap-3 shrink-0 bg-[#0d0f14]">
      <button
        type="button"
        onClick={onCollapse}
        aria-label="Collapse code panel"
        title="Collapse panel"
        className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 transition-colors cursor-pointer shrink-0"
      >
        <PanelRightClose className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <h2 className="text-xs sm:text-sm font-medium text-zinc-100 truncate">
          {title || "Generated Code"}
        </h2>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {activeTab === artifactTab.code && (
          <button
            type="button"
            disabled={!canCopy}
            onClick={onCopy}
            aria-label="Copy current file"
            title={copied ? "Copied" : "Copy file"}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400">
                  Copied
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}

        {canPreview && (
          <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onTabChange(artifactTab.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === artifactTab.code
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange(artifactTab.preview)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === artifactTab.preview
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default ArtifactHeader;
