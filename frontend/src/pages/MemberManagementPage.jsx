import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useGetSociety } from '../hooks/useSociety';
import { useGetMembers } from '../hooks/useMembers';
import { useAuthStore } from '../store/authStore';
import MemberManagement from '../features/societies/MemberManagement';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const MemberManagementPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: society, isLoading: isSocietyLoading, isError: isSocietyError } = useGetSociety(slug);
  const { data: members = [], isLoading: isMembersLoading } = useGetMembers(slug);

  useEffect(() => {
    if (society) {
      document.title = `Members · ${society.name} | UniConnect`;
    }
  }, [society]);

  if (isSocietyLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center mt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isSocietyError || !society) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-10">
        <EmptyState
          icon="🚫"
          title="Society Not Found"
          description="We couldn't load the details for this society."
          action={<Button onClick={() => navigate('/societies')}>Back to Directory</Button>}
        />
      </div>
    );
  }

  const isLeader = society.leader?._id === user?._id;
  const isAdmin = user?.role === 'admin';

  if (!isLeader && !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-10">
        <EmptyState
          icon="🔒"
          title="Access Denied"
          description="Only society leaders and administrators can access member management."
          action={<Button onClick={() => navigate(`/societies/${slug}`)}>Go Back</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeUp">
      <div className="mb-6 flex items-center text-sm font-medium text-muted">
        <Link to="/societies" className="hover:text-primary transition-colors">Societies</Link>
        <ChevronLeft className="w-4 h-4 mx-2 rotate-180" />
        <Link to={`/societies/${slug}`} className="hover:text-primary transition-colors">{society.name}</Link>
        <ChevronLeft className="w-4 h-4 mx-2 rotate-180" />
        <span className="text-primary">Members</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-primary tracking-tight">
            Member Management
          </h1>
          <p className="text-muted mt-2">
            Manage roles and access for <span className="text-primary font-medium">{society.name}</span>.
          </p>
        </div>
        
        <Button variant="secondary" onClick={() => navigate(`/societies/${slug}`)}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Society
        </Button>
      </div>

      <MemberManagement 
        members={members}
        societySlug={slug}
        isLeader={isLeader}
        isAdmin={isAdmin}
        isLoading={isMembersLoading}
      />
    </div>
  );
};

export default MemberManagementPage;
