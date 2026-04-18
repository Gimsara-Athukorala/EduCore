import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Info } from 'lucide-react';
import { societySchema, CATEGORIES_LIST } from './societySchema';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const SocietyForm = ({ defaultValues, onSubmit, isLoading, mode = 'create' }) => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(societySchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      category: defaultValues?.category || CATEGORIES_LIST[0],
      isPublic: defaultValues?.isPublic ?? true,
      tags: defaultValues?.tags || [],
    },
  });

  const descriptionValue = watch('description') || '';
  const currentTags = watch('tags') || [];

  const onFormSubmit = async (data) => {
    try {
      await onSubmit({ ...data, id: defaultValues?._id });
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { type: 'server', message: e.message });
        });
      }
    }
  };

  const addTag = () => {
    const value = tagInput.trim();

    if (value && currentTags.length < 5 && value.length <= 20 && !currentTags.includes(value)) {
      setValue('tags', [...currentTags, value], { shouldValidate: true });
      setTagInput('');
    }
  };

  const handleTagAdd = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setValue('tags', currentTags.filter((tag) => tag !== tagToRemove), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Society Details</p>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            {mode === 'create' ? 'Create a polished society profile' : 'Update society information'}
          </h2>
          <p className="max-w-2xl text-sm text-muted">
            Keep the title clear, the description specific, and the tags focused so students can discover the right community quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Society Name"
            name="name"
            register={register('name')}
            error={errors.name}
            placeholder="e.g., Computer Science Club"
            required
          />

          <div className="space-y-1.5">
            <Input
              label="Description"
              name="description"
              multiline
              register={register('description')}
              error={errors.description}
              placeholder="Describe your society's goals, activities, and the kind of students it welcomes..."
              required
              className="bg-white"
            />
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted">Explain what the society does and why students should join.</p>
              <span className={cn('text-xs font-medium', descriptionValue.length > 1000 ? 'text-red-500' : 'text-muted')}>
                {descriptionValue.length} / 1000
              </span>
            </div>
          </div>
        </div>
      </div>

      <fieldset className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Category</legend>
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-primary">Pick the best category</h3>
          <p className="mt-1 text-sm text-muted">Choose one category so the society appears in the right directory filters.</p>
        </div>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = field.value === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => field.onChange(cat)}
                    aria-pressed={isSelected}
                    className={cn(
                      'min-h-[72px] rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-white',
                      isSelected
                        ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-xl shadow-blue-900/30 ring-2 ring-blue-300/40 scale-[1.02]'
                        : 'border-border bg-white text-muted hover:border-accent/40 hover:bg-accent/5 hover:text-primary hover:shadow-sm hover:-translate-y-0.5'
                    )}
                  >
                    <span className="flex h-full items-start justify-between gap-2">
                      <span className={cn('min-w-0 leading-snug', isSelected && 'font-semibold text-white')}>
                        {cat}
                      </span>
                      {isSelected && (
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/20 text-xs font-bold text-white shadow-sm">
                          ✓
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.category && <p className="mt-3 text-sm text-red-500">{errors.category.message}</p>}
      </fieldset>

      <fieldset className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Tags</legend>

        <div className="mb-5 flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight text-primary">Add searchable tags</h3>
          <p className="text-sm text-muted">Use up to 5 tags. Press Enter or click Add Tag to include one.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleTagAdd}
            disabled={currentTags.length >= 5}
            placeholder={currentTags.length >= 5 ? 'Maximum tags reached' : 'Type a tag and press Enter'}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-primary placeholder:text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addTag}
            disabled={currentTags.length >= 5 || !tagInput.trim()}
            className="sm:px-5"
          >
            Add Tag
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {currentTags.map((tag) => (
            <div key={tag} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-primary shadow-sm">
              <span className="font-medium">#{tag}</span>
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-500 focus:outline-none"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {errors.tags && <p className="mt-3 text-sm text-red-500">{errors.tags.message}</p>}
      </fieldset>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={cn(
                'flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-white',
                field.value
                  ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                  : 'border-blue-300 bg-blue-50 hover:border-blue-400'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('relative h-8 w-16 rounded-full border transition-colors', field.value ? 'border-emerald-600 bg-emerald-500' : 'border-blue-600 bg-blue-500')}>
                  <div className={cn('absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform', field.value ? 'translate-x-8' : 'translate-x-1')} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{field.value ? 'Public Society' : 'Private Society'}</div>
                  <div className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {field.value
                        ? 'Anyone can view the society and join based on the page rules.'
                        : 'Only members can see the member list and private details.'}
                    </span>
                  </div>
                </div>
              </div>
              <span className={cn(
                'rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]',
                field.value
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                  : 'border-blue-300 bg-blue-100 text-blue-700'
              )}>
                {field.value ? 'Visible' : 'Hidden'}
              </span>
            </button>
          )}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          className="sm:min-w-[180px] bg-[#1E3A8A] text-white hover:bg-[#2563EB]"
        >
          {mode === 'create' ? 'Create Society' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

SocietyForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  mode: PropTypes.oneOf(['create', 'edit']),
};

export default SocietyForm;
