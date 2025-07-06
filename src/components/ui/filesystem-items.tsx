"use client";

import { useState } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Node = {
  name: string;
  url?: string;
  nodes?: Node[];
};

interface FilesystemItemProps {
  node: Node;
  animated?: boolean;
  onFileClick?: (url: string, name?: string) => void;
}

const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function FilesystemItem({
  node,
  animated = false,
  onFileClick,
}: FilesystemItemProps) {
  let [isOpen, setIsOpen] = useState(false);
  
  const [itemId] = useState(() => generateRandomId());

  const ChevronIcon = () =>
    animated ? (
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="flex"
      >
        <ChevronRight className="size-4 text-gray-500" />
      </motion.span>
    ) : (
      <ChevronRight
        className={`size-4 text-gray-500 ${isOpen ? "rotate-90" : ""}`}
      />
    );

  const ChildrenList = () => {
    const children = node.nodes?.map((childNode) => (
      <FilesystemItem
        node={childNode}
        key={`${childNode.name}-${generateRandomId()}`}
        animated={animated}
        onFileClick={onFileClick}
      />
    ));

    if (animated) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="pl-6 overflow-hidden flex flex-col justify-end"
            >
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      );
    }

    return isOpen && <ul className="pl-6">{children}</ul>;
  };

  const handleToggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen(!isOpen);
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (node.url && onFileClick) {
      console.log("Clic sur fichier:", node.name, "URL:", node.url);
      onFileClick(node.url, node.name);
    }
  };

  const truncateName = (name: string, maxLength: number = 30) => {
    if (name.length <= maxLength) return name;
    
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex > 0 && lastDotIndex > name.length - 6) {
      const nameWithoutExt = name.substring(0, lastDotIndex);
      const extension = name.substring(lastDotIndex);
      const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3);
      return `${truncatedName}...${extension}`;
    }
    
    return `${name.substring(0, maxLength - 3)}...`;
  };

  return (
    <li key={`${node.name}-${itemId}`}>
      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={handleToggleOpen} className="p-1 -m-1">
            <ChevronIcon />
          </button>
        )}

        {node.nodes ? (
          <span
            onClick={handleToggleOpen}
            className="flex items-center gap-1.5 cursor-pointer select-none rounded px-1 py-0.5 transition-colors"
            title={node.name} 
          >
            <Folder className="size-6 text-primary fill-primary flex-shrink-0" />
            <span className="truncate">{truncateName(node.name)}</span>
          </span>
        ) : (
          <button
            onClick={handleFileClick}
            className="flex items-center gap-1.5 text-left  rounded px-1 py-0.5 transition-colors w-full"
            title={node.name}
          >
            <File className="ml-[22px] size-6 text-foreground flex-shrink-0" />
            <span className="truncate">{truncateName(node.name)}</span>
          </button>
        )}
      </span>

      <ChildrenList />
    </li>
  );
}