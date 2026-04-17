import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Shield, ShieldOff, UserMinus, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatters';
import Avatar from '../../Components/Avatar';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';

const MemberRow = ({ member, isLeader, isAdmin, onRemove, onPromote, isRemoving }) => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const user = member.user || {};
  const isSelf = isLeader; // Logic for "self" would be checking if member.user._id === currentUser._id

  // Actually, we pass isLeader to know if the CURRENT logged in user is the leader of the society.
  // We need to know if the row we are rendering IS the leader.
  const rowIsModerator = member.role === 'moderator';

  // For safety, let's assume if it's a moderator and we are in the member loop,
  // we might not want to show remove/demote if it's the original creator.
  // But standard logic: leader/admin can perform actions.
  const canPerformActions = (isAdmin || isLeader);

  const handleRemoveClick = () => {
    if (showConfirmRemove) {
      onRemove(user._id);
    } else {
      setShowConfirmRemove(true);
      setTimeout(() => setShowConfirmRemove(false), 3000);
    }
  };

  const handlePromoteToggle = () => {
    const newRole = rowIsModerator ? 'member' : 'moderator';
    onPromote({ userId: user._id, role: newRole });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-surface border-b border-border last:border-0 hover:bg-navy/30 transition-colors">
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <Avatar name={user.name} src={user.profilePicture} size="md" />
        <div>
          <div className="font-medium text-primary flex items-center gap-2">
            {user.name || 'Unknown User'}
            {rowIsModerator ? (
              <Badge label="Moderator" color="#0EA5E9" className="opacity-90" />
            ) : (
              <Badge label="Member" className="opacity-70 bg-surface text-muted border-border" />
            )}
          </div>
          <div className="text-xs text-muted mt-0.5">
            <span className="hidden sm:inline">{user.email} • </span>
            Joined {formatDate(member.joinedAt)}
          </div>
        </div>
      </div>

      {canPerformActions && (
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePromoteToggle}
            className="hidden sm:flex border-transparent"
          >
            {rowIsModerator ? (
              <><ShieldOff className="w-4 h-4 mr-2" /> Demote</>
            ) : (
              <><Shield className="w-4 h-4 mr-2" /> Promote</>
            )}
          </Button>
          
          <Button 
            variant={showConfirmRemove ? "danger" : "ghost"} 
            size="sm" 
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className={cn("border-transparent", showConfirmRemove && "border-red-500/20 animate-pulse")}
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <UserMinus className="w-4 h-4 text-red-400" />
            )}
            {showConfirmRemove && <span className="ml-2 text-xs text-red-400">Confirm</span>}
          </Button>
        </div>
      )}
    </div>
  );
};

MemberRow.propTypes = {
  member: PropTypes.shape({
    role: PropTypes.string,
    joinedAt: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      profilePicture: PropTypes.string,
    })
  }).isRequired,
  isLeader: PropTypes.bool,
  isAdmin: PropTypes.bool,
  onRemove: PropTypes.func,
  onPromote: PropTypes.func,
  isRemoving: PropTypes.bool,
};

export default MemberRow;
