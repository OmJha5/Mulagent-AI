import Editor from "@monaco-editor/react";
import { motion } from "motion/react";
import {
  artifactMonacoOptions,
  artifactMonacoTheme,
  artifactMotionConfig,
  artifactPreviewSandbox,
  artifactTab,
  type ArtifactTab,
} from "@/constants/constants";
import type { IArtifactFile } from "@/redux/messageSlice";
import { detectLanguage } from "@/utils/artifact";

interface ArtifactViewerProps {
  artifactId: number;
  activeTab: ArtifactTab;
  previewDoc: string;
  title: string;
  activeFile?: IArtifactFile;
}

function ArtifactViewer({
  artifactId,
  activeTab,
  previewDoc,
  title,
  activeFile,
}: ArtifactViewerProps) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-[#0d0f14]">
      {activeTab === artifactTab.preview ? (
        <motion.div
          key="artifact-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: artifactMotionConfig.contentTransitionDuration }}
          className="w-full h-full bg-white"
        >
          <iframe
            title={title || "Artifact Preview"}
            srcDoc={previewDoc}
            sandbox={artifactPreviewSandbox}
            className="w-full h-full border-0 bg-white"
          />
        </motion.div>
      ) : activeFile ? (
        <motion.div
          key={`artifact-code-${artifactId}-${activeFile.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: artifactMotionConfig.contentTransitionDuration }}
          className="w-full h-full"
        >
          <Editor
            theme={artifactMonacoTheme}
            path={`${artifactId}/${activeFile.name}`}
            language={detectLanguage(activeFile.name)}
            value={activeFile.content}
            loading={
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                Loading editor...
              </div>
            }
            options={artifactMonacoOptions}
          />
        </motion.div>
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center text-xs sm:text-sm text-zinc-500">
          No files available in this artifact.
        </div>
      )}
    </div>
  );
}

export default ArtifactViewer;
