import type { IArtifactFile } from "@/redux/messageSlice";

interface ArtifactFileTabsProps {
  files: IArtifactFile[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
}

function ArtifactFileTabs({
  files,
  activeFileIndex,
  onSelectFile,
}: ArtifactFileTabsProps) {
  if (files.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Artifact files"
      className="flex items-center border-b border-zinc-800/80 bg-[#0b0d12] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0"
    >
      {files.map((file, index) => {
        const isActive = activeFileIndex === index;
        return (
          <button
            key={`${file.name}-${index}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectFile(index)}
            className={`relative px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-r border-zinc-800/70 transition-colors cursor-pointer ${
              isActive
                ? "text-indigo-400 bg-[#0d0f14]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
            }`}
          >
            {file.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ArtifactFileTabs;

