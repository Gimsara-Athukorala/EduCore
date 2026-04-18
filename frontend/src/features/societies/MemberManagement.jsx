import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useRemoveMember, usePromoteMember } from '../../hooks/useMembers';
import { useGetJoinRequests, useReviewJoinRequest } from '../../hooks/useJoinRequests';
import MemberRow from './MemberRow';
import SearchInput from '../../Components/SearchInput';
import EmptyState from '../../Components/EmptyState';
import Spinner from '../../Components/Spinner';
import Button from '../../Components/Button';
import { formatDate } from '../../utils/formatters';

const TABS = ['All', 'Moderators', 'Members', 'Pending Requests'];

const MemberManagement = ({ members = [], societySlug, isLeader, isAdmin, isLoading, initialFilter = 'All' }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(societySlug);
  const { mutate: promoteMember } = usePromoteMember(societySlug);
  const { data: joinRequests = [], isLoading: isJoinRequestsLoading } = useGetJoinRequests(
    societySlug,
    isLeader || isAdmin
  );
  const { mutate: reviewJoinRequest, isPending: isReviewingJoinRequest } = useReviewJoinRequest(societySlug);

  const pendingJoinRequests = joinRequests.filter((request) => request.status === 'pending');

  const filteredMembers = members.filter((m) => {
    // 1. Role filter
    if (filter === 'Moderators' && m.role !== 'moderator') return false;
    if (filter === 'Members' && m.role !== 'member') return false;
    
    // 2. Search filter
    if (search) {
      const term = search.toLowerCase();
      const matchName = (m.user?.name || m.displayName || '').toLowerCase().includes(term);
      const matchEmail = (m.user?.email || m.email || '').toLowerCase().includes(term);
      if (!matchName && !matchEmail) return false;
    }
    
    return true;
  });

  let content = null;

  if (filter === 'Pending Requests') {
    if (isJoinRequestsLoading) {
      content = (
        <div className="p-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      );
    } else if (pendingJoinRequests.length === 0) {
      content = (
        <EmptyState
          icon="📨"
          title="No pending requests"
          description="New join requests will appear here for approval."
          className="border-none"
        />
      );
    } else {
      content = (
        <div className="divide-y divide-border">
          {pendingJoinRequests.map((request) => (
            <div key={request._id} className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-navy/20 transition-colors">
              <div className="space-y-1">
                <div className="text-base font-semibold text-primary">{request.fullName}</div>
                <div className="text-sm text-muted">{request.email} • {request.studentId}</div>
                <p className="text-sm text-primary/90 mt-2 whitespace-pre-wrap">{request.message}</p>
                <div className="text-xs text-muted">Requested on {formatDate(request.requestedAt)}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="secondary"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => reviewJoinRequest({ requestId: request._id, action: 'approve' })}
                  disabled={isReviewingJoinRequest}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => reviewJoinRequest({ requestId: request._id, action: 'reject' })}
                  disabled={isReviewingJoinRequest}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  } else if (isLoading) {
    content = (
      <div className="p-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  } else if (filteredMembers.length === 0) {
    content = (
      <EmptyState
        icon="👥"
        title="No members found"
        description={`We couldn't find any ${filter.toLowerCase()} matching your criteria.`}
        className="border-none"
      />
    );
  } else {
    content = (
      <div className="divide-y divide-border">
        {filteredMembers.map((member) => (
          <MemberRow
            key={member.user?._id || member.email || member.studentId}
            member={member}
            isLeader={isLeader}
            isAdmin={isAdmin}
            onRemove={(id) => removeMember(id)}
            onPromote={promoteMember}
            isRemoving={isRemoving}
          />
        ))}
      </div>
    );
  }

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

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">{content}</div>
    </div>
  );
};

MemberManagement.propTypes = {
  members: PropTypes.array,
  societySlug: PropTypes.string.isRequired,
  isLeader: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isLoading: PropTypes.bool,
  initialFilter: PropTypes.oneOf(TABS),
};

export default MemberManagement;
