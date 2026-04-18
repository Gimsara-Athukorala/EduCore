import React from 'react';
import PropTypes from 'prop-types';
import { User, Calendar, Folder } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../../Components/Badge';

const AboutTab = ({ society }) => {
  const { description, tags, createdAt, leader, category } = society;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeUp">
      <div className="lg:col-span-2 space-y-8">
        {/* Description Section */}
        <section className="bg-surface rounded-2xl border border-border p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-display font-medium tracking-tight text-primary mb-4">About this Society</h2>
          <div className="text-muted leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} label={`#${tag}`} className="bg-navy px-3 py-1 font-mono text-xs opacity-80" />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Placeholder for future sections like "Recent Announcements" */}
        <section className="bg-surface rounded-2xl border border-border p-6 shadow-sm opacity-50 border-dashed">
          <p className="text-center text-muted">Similar societies placeholder (Feature coming soon)</p>
        </section>
      </div>

      <div className="lg:col-span-1 space-y-6">
        {/* Information Panel */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-medium tracking-tight text-primary mb-6">Information</h2>
          
          <dl className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg border border-blue-200 shadow-sm shrink-0">
                <Folder className="w-5 h-5 text-blue-700" strokeWidth={2.4} />
              </div>
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Category</dt>
                <dd className="text-sm text-primary font-medium">{category}</dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg border border-blue-200 shadow-sm shrink-0">
                <User className="w-5 h-5 text-blue-700" strokeWidth={2.4} />
              </div>
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Created By</dt>
                <dd className="text-sm text-primary font-medium">{leader?.name || 'Unknown'}</dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 rounded-lg border border-blue-200 shadow-sm shrink-0">
                <Calendar className="w-5 h-5 text-blue-700" strokeWidth={2.4} />
              </div>
              <div>
                <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Founded On</dt>
                <dd className="text-sm text-primary font-medium">{formatDate(createdAt)}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

AboutTab.propTypes = {
  society: PropTypes.object.isRequired,
};

export default AboutTab;
