import { useMemo, useState } from "react";
import {
  artifactCopyResetDelayMs,
  artifactTab,
  type ArtifactTab,
} from "@/constants/constants";
import type { IArtifact } from "@/redux/messageSlice";
import { buildPreviewDocument } from "@/utils/artifact";
import ArtifactFileTabs from "@/components/artifact/ArtifactFileTabs";
import ArtifactHeader from "@/components/artifact/ArtifactHeader";
import ArtifactViewer from "@/components/artifact/ArtifactViewer";

interface ArtifactPanelBodyProps {
  artifact: IArtifact;
  onCollapse: () => void;
}

function ArtifactPanelBody({ artifact, onCollapse }: ArtifactPanelBodyProps) {
  const [tab, setTab] = useState<ArtifactTab>(artifactTab.code);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const files = useMemo(() => artifact.files ?? [], [artifact.files]);
  const safeFileIndex = activeFileIndex < files.length ? activeFileIndex : 0;
  const activeFile = files[safeFileIndex];

  const { canPreview, previewDoc } = useMemo(
    () => buildPreviewDocument(files),
    [files],
  );

  const effectiveTab =
    tab === artifactTab.preview && canPreview
      ? artifactTab.preview
      : artifactTab.code;

  const handleCopy = async () => {
    if (!activeFile) return;

    try {
      await navigator.clipboard.writeText(activeFile.content ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), artifactCopyResetDelayMs);
    } catch (error) {
      console.error("Failed to copy artifact file:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0d0f14]">
      <ArtifactHeader
        title={artifact.title}
        copied={copied}
        canCopy={Boolean(activeFile)}
        canPreview={canPreview}
        activeTab={effectiveTab}
        onCollapse={onCollapse}
        onCopy={handleCopy}
        onTabChange={setTab}
      />

      {effectiveTab === artifactTab.code && (
        <ArtifactFileTabs
          files={files}
          activeFileIndex={safeFileIndex}
          onSelectFile={setActiveFileIndex}
        />
      )}

      <ArtifactViewer
        artifactId={artifact.id}
        activeTab={effectiveTab}
        previewDoc={previewDoc}
        title={artifact.title}
        activeFile={activeFile}
      />
    </div>
  );
}

export default ArtifactPanelBody;
