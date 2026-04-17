import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Lock, UserMinus } from 'lucide-react';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import SearchInput from '../../components/SearchInput';
import Button from '../../components/Button';
import { formatDate } from '../../utils/formatters';

const MembersTab = ({ members = [], isPublic, isMember, isLeader, isAdmin }) => {
  const [search, setSearch] = useState('');

  // Privacy Check
  if (!isPublic && !isMember && !isAdmin) {
    return (
      <EmptyState
        icon={<Lock className="w-12 h-12 text-muted" />}
        title="Private Members List"
        description="You must be a member of this society to view its members."
        className="animate-fadeUp"
      />
    );
  }

  const filteredMembers = members.filter((m) => {
    if (!m.user?.name) return false;
    return m.user.name.toLowerCase().includes(search.toLowerCase());
  });

  if (members.length === 0) {
    return (
      <EmptyState
        icon="👋"
        title="No members yet"
        description="Be the first to join this society!"
        className="animate-fadeUp"
      />
    );
  }

  return (
    <div className="animate-fadeUp">
      <div className="mb-6 flex justify-between items-center sm:max-w-md">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search members by name..."
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-muted">
            No members match your search criteria.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.user._id || member.user} className="p-4 sm:p-6 flex items-center justify-between hover:bg-navy/30 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar name={member.user.name} src={member.user.profilePicture} size="md" />
                <div>
                  <div className="font-medium text-primary flex items-center gap-2">
                    {member.user.name || 'Unknown User'}
                    {member.role === 'moderator' && <Badge label="Leader" color="#0EA5E9" className="opacity-90" />}
                  </div>
                  <div className="text-xs text-muted mt-0.5">Joined {formatDate(member.joinedAt)}</div>
                </div>
              </div>

              {(isLeader || isAdmin) && member.role !== 'moderator' && (
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 hidden sm:flex border-transparent">
                  <UserMinus className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

MembersTab.propTypes = {
  members: PropTypes.array,
  isPublic: PropTypes.bool.isRequired,
  isMember: PropTypes.bool.isRequired,
  isLeader: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default MembersTab;
