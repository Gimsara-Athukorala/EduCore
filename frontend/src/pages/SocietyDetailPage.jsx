import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useGetSociety, useJoinSociety, useLeaveSociety, useDeleteSociety } from '../hooks/useSociety';
import SocietyHero from '../features/societies/SocietyHero';
import SocietyTabs from '../features/societies/SocietyTabs';
import AboutTab from '../features/societies/AboutTab';
import MembersTab from '../features/societies/MembersTab';
import ResourcesTab from '../features/societies/ResourcesTab';
import EmptyState from '../Components/EmptyState';
import Button from '../Components/Button';
import Spinner from '../Components/Spinner';

const SocietyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('about');

  const { data: society, isLoading, isError } = useGetSociety(slug);
  const joinMutation = useJoinSociety(slug);
  const leaveMutation = useLeaveSociety(slug);
  const deleteMutation = useDeleteSociety();

  useEffect(() => {
    if (society) {
      document.title = `${society.name} | UniConnect`;
    }
  }, [society]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center mt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !society) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <EmptyState
          icon="🚫"
          title="Society Not Found"
          description="The society you are looking for does not exist or has been removed."
          action={
            <Button onClick={() => navigate('/societies')} className="mt-4">
              Back to Directory
            </Button>
          }
        />
      </div>
    );
  }

  // Determine user permissions relative to this society
  const isLeader = society.leader?._id === user?._id;
  const isMember = society.members?.some(m => m.user._id === user?._id) || isLeader;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeUp">
      <SocietyHero 
        society={society}
        isMember={isMember}
        isLeader={isLeader}
        isAdmin={isAdmin}
        onJoin={() => joinMutation.mutate()}
        onLeave={() => leaveMutation.mutate()}
        joinLoading={joinMutation.isPending || leaveMutation.isPending}
        onDelete={() => {
          if(window.confirm(`Are you sure you want to hard delete "${society.name}"? This action cannot be undone.`)) {
            deleteMutation.mutate(society._id);
          }
        }}
      />

      <SocietyTabs 
        society={society}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMember={isMember}
      />

      <div className="mt-8">
        {activeTab === 'about' && <AboutTab society={society} />}
        
        {activeTab === 'members' && (
          <MembersTab 
            members={society.members} 
            isPublic={society.isPublic}
            isMember={isMember}
            isLeader={isLeader}
            isAdmin={isAdmin}
          />
        )}
        
        {activeTab === 'resources' && (
          <ResourcesTab 
            resources={society.resources}
            societyId={society._id}
            isLeader={isLeader}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default SocietyDetailPage;
