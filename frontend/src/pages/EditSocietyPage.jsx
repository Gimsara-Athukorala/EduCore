import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocietyForm from '../features/societies/SocietyForm';
import { useGetSociety } from '../hooks/useSociety';
import { useUpdateSociety } from '../hooks/useSocietyMutations';
import { useAuthStore } from '../store/authStore';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const EditSocietyPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: society, isLoading, isError } = useGetSociety(slug);
  const { mutateAsync: updateSociety, isPending } = useUpdateSociety(slug);

  useEffect(() => {
    if (society) {
      document.title = `Edit ${society.name} | UniConnect`;
    }
  }, [society]);

  const handleSubmit = async (data) => {
    await updateSociety(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center mt-20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted text-sm font-medium animate-pulse">Loading society details...</p>
        </div>
      </div>
    );
  }

  if (isError || !society) {
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

  // Gate: Only leaders and admins can edit
  const isLeader = society.leader?._id === user?._id;
  const isAdmin = user?.role === 'admin';

  if (!isLeader && !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 mt-10">
        <EmptyState
          icon="🔒"
          title="Access Denied"
          description="You do not have permission to edit this society."
          action={<Button onClick={() => navigate(-1)}>Go Back</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeUp">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-primary tracking-tight">
          Edit Society
        </h1>
        <p className="text-muted mt-2">
          Update the details and settings for <span className="text-primary font-medium">{society.name}</span>.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <SocietyForm 
          defaultValues={society}
          onSubmit={handleSubmit} 
          isLoading={isPending} 
          mode="edit" 
        />
      </div>
    </div>
  );
};

export default EditSocietyPage;
