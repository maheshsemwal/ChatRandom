import { X } from "lucide-react";
import { motion } from "framer-motion";

const FilePreviewBox = ({ file, onClose }: { file: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative w-28 h-28 rounded-md overflow-hidden border border-border shadow-md"
    >
      <img
        src={file}
        alt="preview"
        className="w-full h-full object-cover rounded-md"
      />
      <button
        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default FilePreviewBox;
