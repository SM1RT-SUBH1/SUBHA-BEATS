"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileMusic, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-8" onClick={handleClick}>
      <motion.div
        whileHover="animate"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) {
            handleFileChange(Array.from(e.dataTransfer.files));
          }
        }}
        className={cn(
          "p-10 group/drop rounded-2xl cursor-pointer relative border-2 border-dashed border-neutral-700 hover:border-purple-500/60 bg-neutral-900/60 transition-colors flex flex-col items-center justify-center min-h-[18rem]",
          isDragOver && "border-cyan-400 bg-neutral-900/90"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(Array.from(e.target.files));
            }
          }}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <motion.div
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="p-4 rounded-2xl bg-neutral-800 text-purple-400 shadow-xl border border-neutral-700"
            >
              <UploadCloud className="w-8 h-8" />
            </motion.div>
            <motion.div
              variants={secondaryVariant}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-cyan-500 text-white"
            >
              <FileMusic className="w-4 h-4" />
            </motion.div>
          </div>

          <p className="font-bold text-neutral-200 text-base mb-1">
            Upload track files, audio or artwork
          </p>
          <p className="text-xs text-neutral-400 max-w-xs mb-4">
            Drag & drop master MP3, FLAC or cover artwork, or browse files from your device.
          </p>

          <span className="px-4 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold group-hover/drop:bg-purple-600 group-hover/drop:text-white transition-all">
            Select files
          </span>
        </div>

        {files.length > 0 && (
          <div className="w-full mt-6 space-y-2 max-w-md">
            {files.map((file, idx) => (
              <motion.div
                key={file.name + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileMusic className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-neutral-200 truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono flex-shrink-0 ml-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
