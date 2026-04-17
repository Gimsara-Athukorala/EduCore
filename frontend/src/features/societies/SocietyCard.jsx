import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Users, FileText, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatNumber } from '../../utils/formatters';
import Badge from '../../components/Badge';

const SocietyCard = ({ society }) => {
  const {
    name,
    slug,
    description,
    category,
    memberCount,
    resourceCount = 0,
    leader,
    isPublic,
    tags = []
  } = society;

  return (
    <Link
      to={`/societies/${slug}`}
      className="group relative flex flex-col h-full bg-white border border-gray-100 rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 focus:outline-none focus:ring-4 focus:ring-primary-light/20"
    >
      {!isPublic && (
        <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
          <Lock className="w-3 h-3" /> Private
        </div>
      )}

      {/* Decorative accent on hover */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-dark to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[32px]" />

      <div className="flex items-start justify-between mb-6">
        <Badge label={category} color="#3B82F6" className="font-black text-[9px] px-3 py-1 bg-blue-50 border-none uppercase tracking-widest" />
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-display font-extrabold text-primary-dark mb-3 line-clamp-1 group-hover:text-primary-light transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-muted line-clamp-3 mb-6 leading-relaxed font-medium">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] text-primary-light font-black uppercase tracking-tight bg-primary-light/5 px-2.5 py-1 rounded-lg border border-primary-light/10">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-muted font-bold flex items-center">+{tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-widest text-muted">
          <div className="flex items-center gap-2 group-hover:text-primary-light transition-colors" title="Members">
            <Users className="w-4 h-4 opacity-70" />
            <span>{formatNumber(memberCount)}</span>
          </div>
          <div className="flex items-center gap-2 group-hover:text-primary-light transition-colors" title="Resources">
            <FileText className="w-4 h-4 opacity-70" />
            <span>{formatNumber(resourceCount)}</span>
          </div>
        </div>
        {leader?.name && (
          <div className="text-[11px] text-muted font-bold truncate max-w-[120px] italic">
            by <span className="text-primary-dark not-italic">{leader.name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

SocietyCard.propTypes = {
  society: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    memberCount: PropTypes.number,
    resourceCount: PropTypes.number,
    leader: PropTypes.shape({
      name: PropTypes.string
    }),
    isPublic: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export const SocietyCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white border border-gray-100 rounded-[32px] p-8 min-h-[320px] shadow-sm">
    <div className="w-24 h-6 mb-8 rounded-full bg-gray-50 animate-pulse" />
    <div className="w-3/4 h-8 mb-4 rounded-xl bg-gray-100 animate-pulse" />
    <div className="w-full h-4 mb-2 rounded bg-gray-50 animate-pulse" />
    <div className="w-5/6 h-4 mb-8 rounded bg-gray-50 animate-pulse" />
    <div className="flex gap-2 mb-10 mt-auto">
      <div className="w-16 h-6 rounded-lg bg-gray-100 animate-pulse" />
      <div className="w-18 h-6 rounded-lg bg-gray-100 animate-pulse" />
    </div>
    <div className="pt-6 border-t border-gray-50 flex justify-between">
      <div className="w-20 h-4 rounded bg-gray-100 animate-pulse" />
      <div className="w-24 h-4 rounded bg-gray-100 animate-pulse" />
    </div>
  </div>
);

SocietyCard.Skeleton = SocietyCardSkeleton;

export default SocietyCard;
