import React, { useEffect } from 'react';
import SocietyForm from '../features/societies/SocietyForm';
import { useCreateSociety } from '../hooks/useSocietyMutations';

const CreateSocietyPage = () => {
  const { mutateAsync: createSociety, isPending } = useCreateSociety();

  useEffect(() => {
    document.title = 'Create Society | UniConnect';
  }, []);

  const handleSubmit = async (data) => {
    await createSociety(data);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeUp">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-primary tracking-tight">
          Create a New Society
        </h1>
        <p className="text-muted mt-2">
          Start a new community and bring students together. Fill out the details below.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <SocietyForm 
          onSubmit={handleSubmit} 
          isLoading={isPending} 
          mode="create" 
        />
      </div>
    </div>
  );
};

export default CreateSocietyPage;
