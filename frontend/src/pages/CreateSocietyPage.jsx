import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SocietyForm from '../features/societies/SocietyForm';
import { useCreateSociety } from '../hooks/useSocietyMutations';
import SocietyLeaderDashboardShell from '../Components/Navigations/SocietyLeaderDashboardShell';
import Toast from '../common/toast';
import { useGetSocieties } from '../hooks/useSocieties';
import { useAuthStore } from '../store/authStore';

const CreateSocietyPage = () => {
  const { mutateAsync: createSociety, isPending } = useCreateSociety();
  const { user } = useAuthStore();
  const [formKey, setFormKey] = useState(0);
  const [activeHookTab, setActiveHookTab] = useState('requests');
  const [toastState, setToastState] = useState({
    isOpen: false,
    message: '',
    variant: 'success',
  });

  const listingFilters = useMemo(
    () => ({ category: '', search: '', page: 1, limit: 100 }),
    []
  );
  const { data: societiesData, isLoading: isSocietiesLoading } = useGetSocieties(listingFilters);

  const visibleSocieties = useMemo(() => {
    const societies = societiesData?.societies || [];
    const currentUserId = user?._id || user?.id;

    if (user?.role === 'admin') {
      return societies;
    }

    return societies.filter((society) => {
      const leaderId = society?.leader?._id || society?.leader?.id || society?.leader;
      return leaderId && currentUserId && String(leaderId) === String(currentUserId);
    });
  }, [societiesData, user?._id, user?.id, user?.role]);

  useEffect(() => {
    document.title = 'Create Society | UniConnect';
  }, []);

  const closeToast = () => {
    setToastState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (data) => {
    try {
      await createSociety(data);
      setToastState({
        isOpen: true,
        message: 'Society created successfully!',
        variant: 'success',
      });
      setFormKey((prev) => prev + 1);
    } catch (error) {
      // Error is already handled by the hook's onError callback with detailed messages
      console.error('Create society error:', error);
    }
  };

  let joinRequestsContent = null;

  if (isSocietiesLoading) {
    joinRequestsContent = <p className="text-sm text-muted mt-4">Loading your societies...</p>;
  } else if (visibleSocieties.length === 0) {
    joinRequestsContent = (
      <div className="mt-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-800">
        No societies found yet. Create one above, then requests will appear in this section.
      </div>
    );
  } else {
    joinRequestsContent = (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleSocieties.map((society) => (
          <Link
            key={society._id}
            to={`/societies/${society.slug}/members?tab=requests`}
            className="rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 hover:bg-blue-50 transition-colors"
          >
            <p className="text-sm font-semibold text-blue-800">{society.name}</p>
            <p className="text-xs text-blue-600 mt-1">View pending join requests</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <SocietyLeaderDashboardShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeUp">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-xl border border-blue-100 bg-white p-1 shadow-sm gap-1">
            <button
              type="button"
              onClick={() => setActiveHookTab('requests')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeHookTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              Requests
            </button>
            <button
              type="button"
              onClick={() => setActiveHookTab('create')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeHookTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              Create Form
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-primary tracking-tight">
            Create a New Society
          </h1>
          <p className="text-muted mt-2">
            Start a new community and bring students together. Fill out the details below.
          </p>
        </div>

        {activeHookTab === 'create' ? (
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <SocietyForm
              key={formKey}
              onSubmit={handleSubmit}
              isLoading={isPending}
              mode="create"
            />
          </div>
        ) : (
          <div id="requests-section" className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-primary">Join Requests</h2>
            <p className="text-sm text-muted mt-2">
              Open request queues for your societies and approve or reject membership requests.
            </p>
            {joinRequestsContent}
          </div>
        )}
      </div>

      <Toast
        isOpen={toastState.isOpen}
        message={toastState.message}
        variant={toastState.variant}
        onClose={closeToast}
      />
    </SocietyLeaderDashboardShell>
  );
};

export default CreateSocietyPage;
