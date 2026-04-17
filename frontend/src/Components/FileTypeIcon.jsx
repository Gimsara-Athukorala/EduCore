import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Image, Film, File } from 'lucide-react';
import { cn } from '../utils/cn';

const types = {
  pdf: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: FileText, label: 'PDF' },
  image: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Image, label: 'IMAGE' },
  video: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Film, label: 'VIDEO' },
  other: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: File, label: 'FILE' },
};

const FileTypeIcon = ({ fileType = 'other', className }) => {
  const typeConfig = types[fileType?.toLowerCase()] || types.other;
  const Icon = typeConfig.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium',
        typeConfig.color,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {typeConfig.label}
    </div>
  );
};

FileTypeIcon.propTypes = {
  fileType: PropTypes.oneOf(['pdf', 'image', 'video', 'other', 'PDF', 'IMAGE', 'VIDEO', 'OTHER']),
  className: PropTypes.string,
};

export default FileTypeIcon;
