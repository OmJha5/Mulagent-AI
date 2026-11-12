import { useState } from "react";
import { motion } from "motion/react";
import {
  artifactMotionConfig,
  artifactPanelSize,
} from "@/constants/constants";
import { useAppSelector } from "@/redux/store";
import ArtifactCollapsedStrip from "@/components/artifact/ArtifactCollapsedStrip";
import ArtifactPanelBody from "@/components/artifact/ArtifactPanelBody";

function Artifact() {
  const { artifacts } = useAppSelector((state) => state.messages);
  const [collapsedArtifactId, setCollapsedArtifactId] = useState<number | null>(
    null,
  );

  const currentArtifact = artifacts[0];
  if (!currentArtifact) return null;

  const isCollapsed = collapsedArtifactId === currentArtifact.id;

  return (
    <motion.div
      initial={{ width: artifactPanelSize.expandedWidth }}
      animate={{
        width: isCollapsed
          ? artifactPanelSize.collapsedWidth
          : artifactPanelSize.expandedWidth,
      }}
      transition={{
        duration: artifactMotionConfig.panelTransitionDuration,
        ease: "easeInOut",
      }}
      className="hidden md:flex h-full border-l border-zinc-800/80 flex-col overflow-hidden shrink-0 bg-[#0d0f14]"
    >
      {isCollapsed ? (
        <ArtifactCollapsedStrip
          title={currentArtifact.title}
          onExpand={() => setCollapsedArtifactId(null)}
        />
      ) : (
        <ArtifactPanelBody
          key={currentArtifact.id}
          artifact={currentArtifact}
          onCollapse={() => setCollapsedArtifactId(currentArtifact.id)}
        />
      )}
    </motion.div>
  );
}

export default Artifact;
