import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Download, Trash2, Loader2 } from 'lucide-react';
import { formatFileSize, formatDate } from '../../utils/formatters';
import FileTypeIcon from '../../components/FileTypeIcon';
import Button from '../../components/Button';

const ResourceCard = ({ resource, canDelete, onDelete, isDeleting }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (showConfirm) {
      onDelete(resource._id);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // Reset confirm state after 3s
    }
  };

  const handleDownload = () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-surface border border-border rounded-xl hover:bg-navy/30 transition-colors animate-fadeUp">
      <div className="flex items-center gap-4 min-w-0 pr-4">
        <FileTypeIcon fileType={resource.fileType} />
        
        <div className="min-w-0">
          <h4 className="text-primary font-medium truncate" title={resource.originalName}>
            {resource.originalName}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted mt-1">
            <span>{formatFileSize(resource.size)}</span>
            <span>•</span>
            <span>{formatDate(resource.uploadedAt)}</span>
            {resource.uploadedBy?.name && (
              <>
                <span>•</span>
                <span className="truncate max-w-[100px]">By {resource.uploadedBy.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="secondary" size="sm" onClick={handleDownload} aria-label="Download">
          <Download className="w-4 h-4" />
        </Button>
        
        {canDelete && (
          <Button 
            variant={showConfirm ? "danger" : "ghost"} 
            size="sm" 
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={showConfirm ? "animate-pulse" : ""}
            aria-label={showConfirm ? "Confirm Delete" : "Delete resource"}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4 text-red-400" />
            )}
            {showConfirm && <span className="ml-2 text-xs">Confirm</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

ResourceCard.propTypes = {
  resource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    originalName: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    uploadedAt: PropTypes.string.isRequired,
    uploadedBy: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
};

export default ResourceCard;
