import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  maxFiles = 5, 
  maxSize = 10, 
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelection(files);
  };

  const handleFileSelection = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/5'
            : 'border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)]/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept={acceptedTypes.join(',')}
        />
        
        <Upload className="w-12 h-12 text-[var(--neon-cyan)] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Upload Files
        </h3>
        <p className="text-gray-400 mb-4">
          Drag and drop files here or click to browse
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-[var(--dark-bg)] hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25"
        >
          Select Files
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Maximum {maxFiles} files, up to {maxSize}MB each
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[var(--dark-bg)]/50 border border-[var(--neon-cyan)]/30 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-[var(--neon-cyan)]" />
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
