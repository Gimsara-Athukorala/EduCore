import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUploadResource } from '../../hooks/useResources';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.mp4'];

const ResourceUploadZone = ({ societyId }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileState, setFileState] = useState({ state: 'idle', message: '', progress: 0 });
  const fileInputRef = useRef(null);
  const { mutateAsync: uploadResource } = useUploadResource(societyId);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateAndUpload = async (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileState({ state: 'error', message: 'File exceeds 50MB limit', progress: 0 });
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileState({ state: 'error', message: 'Unsupported file type', progress: 0 });
      return;
    }

    setFileState({ state: 'uploading', message: `Uploading ${file.name}...`, progress: 0 });

    try {
      await uploadResource({
        file,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFileState(prev => ({ ...prev, progress: percentCompleted }));
        }
      });
      setFileState({ state: 'success', message: 'Upload complete!', progress: 100 });
      
      // Reset after a delay
      setTimeout(() => setFileState({ state: 'idle', message: '', progress: 0 }), 3000);
    } catch (err) {
      setFileState({ state: 'error', message: 'Upload failed.', progress: 0 });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mb-8">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileState.state !== 'uploading' && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all select-none",
          fileState.state !== 'uploading' && "cursor-pointer",
          isDragActive 
            ? "border-accent bg-accent/5 scale-[1.01]" 
            : "border-border bg-surface hover:bg-surface/80",
          fileState.state === 'error' && "border-red-500/50 bg-red-500/5",
          fileState.state === 'success' && "border-green-500/50 bg-green-500/5"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          disabled={fileState.state === 'uploading'}
        />

        {fileState.state === 'idle' && (
          <>
            <UploadCloud className="w-10 h-10 text-muted mb-3" />
            <p className="text-primary font-medium">Click or drag file to this area to upload</p>
            <p className="text-muted text-sm mt-1">Supports PDF, JPG, PNG, MP4 (Max 50MB)</p>
          </>
        )}

        {fileState.state === 'uploading' && (
          <div className="w-full max-w-xs text-center">
            <UploadCloud className="w-10 h-10 text-accent mb-3 mx-auto animate-bounce" />
            <p className="text-primary font-medium mb-3">{fileState.message}</p>
            <div className="w-full h-2 bg-navy rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${fileState.progress}%` }}
              />
            </div>
            <p className="text-muted text-sm mt-2">{fileState.progress}%</p>
          </div>
        )}

        {fileState.state === 'error' && (
          <>
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-red-400 font-medium">{fileState.message}</p>
            <p className="text-muted text-sm mt-1">Click to try again</p>
          </>
        )}

        {fileState.state === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-green-400 mb-3" />
            <p className="text-green-400 font-medium">{fileState.message}</p>
          </>
        )}
      </div>
    </div>
  );
};

ResourceUploadZone.propTypes = {
  societyId: PropTypes.string.isRequired,
};

export default ResourceUploadZone;
