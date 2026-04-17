import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRemoveMember, usePromoteMember } from '../../hooks/useMembers';
import MemberRow from './MemberRow';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';

const TABS = ['All', 'Moderators', 'Members'];

const MemberManagement = ({ members = [], societySlug, isLeader, isAdmin, isLoading }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(societySlug);
  const { mutate: promoteMember } = usePromoteMember(societySlug);

  const filteredMembers = members.filter((m) => {
    // 1. Role filter
    if (filter === 'Moderators' && m.role !== 'moderator') return false;
    if (filter === 'Members' && m.role !== 'member') return false;
    
    // 2. Search filter
    if (search) {
      const term = search.toLowerCase();
      const matchName = m.user?.name?.toLowerCase().includes(term);
      const matchEmail = m.user?.email?.toLowerCase().includes(term);
      if (!matchName && !matchEmail) return false;
    }
    
    return true;
  });

  return (
    <div className="animate-fadeUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === tab 
                  ? 'bg-navy text-primary shadow-sm border border-border/50' 
                  : 'text-muted hover:text-primary hover:bg-surface/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search members..."
          className="w-full sm:w-64"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No members found"
            description={`We couldn't find any ${filter.toLowerCase()} matching your criteria.`}
            className="border-none"
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredMembers.map((member) => (
              <MemberRow
                key={member.user._id}
                member={member}
                isLeader={isLeader}
                isAdmin={isAdmin}
                onRemove={(id) => removeMember(id)}
                onPromote={promoteMember}
                isRemoving={isRemoving}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MemberManagement.propTypes = {
  members: PropTypes.array,
  societySlug: PropTypes.string.isRequired,
  isLeader: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default MemberManagement;
