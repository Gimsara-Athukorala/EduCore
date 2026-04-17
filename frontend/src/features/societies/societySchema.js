import { z } from 'zod';

const CATEGORIES = [
  'Engineering',
  'Finance & Technology',
  'Arts & Culture',
  'Social Impact',
  'Sports',
  'Science',
  'Health & Wellness',
  'Other'
];

export const societySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be at most 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be at most 1000 characters'),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: 'Please select a valid category' }) }),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string().max(20, 'Tag cannot exceed 20 characters')).max(5, 'Maximum 5 tags allowed').default([]),
});

export const CATEGORIES_LIST = CATEGORIES;
