import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResourceUploadZone from './ResourceUploadZone';
import ResourceCard from './ResourceCard';
import EmptyState from '../../components/EmptyState';
import { useDeleteResource } from '../../hooks/useResources';
import { cn } from '../../utils/cn';

const FILTERS = ['All', 'PDF', 'Image', 'Video', 'Other'];

const ResourcesTab = ({ resources = [], societyId, isLeader, isAdmin }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { mutate: deleteResource, isPending: isDeleting } = useDeleteResource(societyId);

  const canUploadOrDelete = isLeader || isAdmin;

  const filteredResources = resources.filter(res => {
    if (activeFilter === 'All') return true;
    return res.fileType?.toLowerCase() === activeFilter.toLowerCase();
  }).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)); // newest first

  return (
    <div className="animate-fadeUp">
      {canUploadOrDelete && (
        <ResourceUploadZone societyId={societyId} />
      )}

      {resources.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map(filter => {
              const count = filter === 'All' 
                ? resources.length 
                : resources.filter(r => r.fileType?.toLowerCase() === filter.toLowerCase()).length;
              
              if (count === 0 && filter !== 'All') return null; // hide empty filter tabs

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    activeFilter === filter
                      ? "bg-surface border border-border text-primary shadow-sm"
                      : "bg-transparent border border-transparent text-muted hover:text-primary hover:bg-surface/50"
                  )}
                >
                  {filter}
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-md",
                    activeFilter === filter ? "bg-accent/20 text-accent" : "bg-navy text-muted"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredResources.map(resource => (
              <ResourceCard 
                key={resource._id}
                resource={resource}
                canDelete={canUploadOrDelete}
                onDelete={deleteResource}
                isDeleting={isDeleting}
              />
            ))}
            {filteredResources.length === 0 && (
              <div className="text-center p-8 text-muted border border-dashed border-border rounded-xl bg-surface/30">
                No resources match the selected filter.
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon="📦"
          title="No uploaded resources"
          description={canUploadOrDelete ? "Upload documents, images, or videos to share with your society members." : "This society hasn't shared any resources yet."}
        />
      )}
    </div>
  );
};

ResourcesTab.propTypes = {
  resources: PropTypes.array,
  societyId: PropTypes.string.isRequired,
  isLeader: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default ResourcesTab;
