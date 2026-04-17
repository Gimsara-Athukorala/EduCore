import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Info } from 'lucide-react';
import { societySchema, CATEGORIES_LIST } from './societySchema';
import Input from '../../components/Input';
import Button from '../../components/Button';
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
  const currentTags = watch('tags');

  const onFormSubmit = async (data) => {
    try {
      await onSubmit({ ...data, id: defaultValues?._id }); // pass ID if available for update
    } catch (err) {
      // If server returns validation errors, map them to fields
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { type: 'server', message: e.message });
        });
      }
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && currentTags.length < 5 && val.length <= 20 && !currentTags.includes(val)) {
        setValue('tags', [...currentTags, val], { shouldValidate: true });
        setTagInput('');
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setValue('tags', currentTags.filter(t => t !== tagToRemove), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
          placeholder="Describe your society's goals and activities..."
          required
        />
        <div className="flex justify-end pr-1">
          <span className={cn('text-xs', descriptionValue.length > 1000 ? 'text-red-400' : 'text-muted')}>
            {descriptionValue.length} / 1000
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-primary">Category <span className="text-red-400">*</span></label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => field.onChange(cat)}
                  className={cn(
                    'p-3 rounded-xl border text-sm font-medium text-left transition-all',
                    field.value === cat
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface text-muted hover:border-muted hover:text-primary'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        />
        {errors.category && <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-primary flex items-center gap-2">
            Tags
            <span className="text-xs text-muted font-normal bg-navy px-2 py-0.5 rounded-full border border-border">
              {currentTags.length} / 5
            </span>
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            disabled={currentTags.length >= 5}
            placeholder={currentTags.length >= 5 ? "Maximum tags reached" : "Type a tag and press Enter"}
            className="w-full rounded-lg bg-surface border border-border px-4 py-2 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors disabled:opacity-50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {currentTags.map(tag => (
            <div key={tag} className="flex items-center gap-1 bg-navy px-3 py-1 rounded-md border border-border/50 text-sm text-primary">
              #{tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="text-muted hover:text-red-400 p-0.5 rounded-full focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {errors.tags && <p className="text-sm text-red-400 mt-1">{errors.tags.message}</p>}
      </div>

      <div className="pt-4 border-t border-border">
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-4 cursor-pointer group">
              <div
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  field.value ? 'bg-accent' : 'bg-surface border border-border'
                )}
                onClick={() => field.onChange(!field.value)}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                    field.value ? 'translate-x-6' : 'translate-x-0.5 bg-muted'
                  )}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-primary">
                  {field.value ? 'Public Society' : 'Private Society'}
                </div>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <Info className="w-3 h-3" />
                  {field.value 
                    ? 'Anyone can view the member list and join immediately.' 
                    : 'The member list is hidden to non-members.'}
                </div>
              </div>
            </label>
          )}
        />
      </div>

      <div className="pt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
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
  mode: PropTypes.oneOf(['create', 'edit'])
};

export default SocietyForm;
