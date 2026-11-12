import { PanelRightOpen } from "lucide-react";

interface ArtifactCollapsedStripProps {
  title: string;
  onExpand: () => void;
}

function ArtifactCollapsedStrip({
  title,
  onExpand,
}: ArtifactCollapsedStripProps) {
  return (
    <div className="flex h-full w-full bg-[#0d0f14] flex-col items-center py-4 gap-4 shrink-0">
      <button
        type="button"
        onClick={onExpand}
        aria-label="Expand code panel"
        title="Expand panel"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 transition-colors cursor-pointer shrink-0"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>

      <div className="flex-1 min-h-0 flex items-start justify-center overflow-hidden">
        <span className="[writing-mode:vertical-lr] rotate-0 text-xs font-medium text-zinc-500 tracking-widest uppercase truncate max-h-64 select-none">
          {title || "Generated Code"}
        </span>
      </div>
    </div>
  );
}

export default ArtifactCollapsedStrip;
