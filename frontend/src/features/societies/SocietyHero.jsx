import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Lock, Settings, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../Components/Badge';
import { formatNumber } from '../../utils/formatters';
import JoinRequestModal from './JoinRequestModal';

const SocietyHero = ({ society, isMember, isLeader, isAdmin, onJoin, onLeave, joinLoading, onDelete }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { name, category, memberCount, resourceCount, leader, isPublic } = society;

  const handleActionClick = () => {
    if (!isAuthenticated) {
      setIsJoinModalOpen(true);
      return;
    }
    if (isMember) {
      onLeave();
    } else {
      onJoin();
    }
  };

  const getActionConf = () => {
    if (!isAuthenticated) return { label: 'Sign in to Join', variant: 'primary' };
    if (isMember) return { label: 'Leave Society', variant: 'ghost' };
    return { label: 'Join Society', variant: 'primary' };
  };

  const { label } = getActionConf();
  const showActionBtn = !isLeader && !isAdmin && (!isAuthenticated || user?.role === 'student');

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-[40px] p-10 md:p-16 mb-12 relative overflow-hidden shadow-2xl text-gray-900">
        {/* Premium Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none select-none overflow-hidden">
          <Users className="w-[500px] h-[500px] absolute -right-20 -top-20 text-blue-500" />
        </div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(37,99,235,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Badge label={category} color="#DBEAFE" className="text-blue-700 border-blue-200 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5" />
          {!isPublic && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-300 backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5" /> Private Organization
            </div>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-10 leading-[0.9]">
          {name}
        </h1>

        <div className="flex flex-wrap items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-black">{formatNumber(memberCount)}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Active Members</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-black">{formatNumber(resourceCount)}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">Study Resources</div>
            </div>
          </div>
          {leader?.name && (
            <div className="flex items-center gap-3 pl-8 border-l border-blue-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 block">Organization Lead</div>
              <div className="text-lg font-black">{leader.name}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-5 pt-4">
          {showActionBtn && (
            <button
              onClick={handleActionClick}
              disabled={joinLoading}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center min-w-[200px]"
            >
              {joinLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : label}
            </button>
          )}

          {(isLeader || isAdmin) && (
            <button 
              onClick={() => navigate(`/societies/${society.slug}/edit`)}
              className="px-8 py-4 bg-white border border-blue-200 text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg flex items-center"
            >
              <Settings className="w-4 h-4 mr-3" />
              Manage Hub
            </button>
          )}

          {isAdmin && (
            <button 
              onClick={onDelete}
              className="px-8 py-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete Organzation
            </button>
          )}
        </div>
        </div>
      </div>

      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        societySlug={society.slug}
        societyName={society.name}
      />
    </>
  );
};

SocietyHero.propTypes = {
  society: PropTypes.object.isRequired,
  isMember: PropTypes.bool.isRequired,
  isLeader: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  joinLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
};

export default SocietyHero;
