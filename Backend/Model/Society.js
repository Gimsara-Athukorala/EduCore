const mongoose = require('mongoose');
const joi = require('joi');

const Schema = mongoose.Schema;

/**
 * Mongoose Schema for University Society
 */
const SocietySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a society name'],
      unique: true,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Engineering', 'Finance & Technology', 'Arts & Culture',
          'Social Impact', 'Sports', 'Science', 'Health & Wellness', 'Other'
        ],
        message: '{VALUE} is not a valid category'
      }
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        },
        role: {
          type: String,
          enum: ['member', 'moderator'],
          default: 'member'
        }
      }
    ],
    memberCount: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resources: [
      {
        filename: String,
        originalName: String,
        fileType: {
          type: String,
          enum: ['pdf', 'image', 'video', 'other'],
          default: 'other'
        },
        size: Number,
        url: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    tags: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.length <= 5 && v.every(tag => tag.length <= 20);
        },
        message: 'A society can have up to 5 tags, with each tag maximum 20 characters'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
// Text index for search
SocietySchema.index({ name: 'text', description: 'text' });
// Normal indexes for common queries
SocietySchema.index({ category: 1, isActive: 1, isPublic: 1 });

// Virtuals
SocietySchema.virtual('resourceCount').get(function() {
  return this.resources ? this.resources.length : 0;
});

// Middleware (Pre-save)
SocietySchema.pre('save', function(next) {
  // Auto-generate slug from name
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, '') // remove all non-word chars except space
      .replace(/ +/g, '-');    // replace spaces with hyphen
  }

  // Sync memberCount with members.length
  if (this.isModified('members')) {
    this.memberCount = this.members.length;
  }

  next();
});

// Instance Methods
SocietySchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString());
};

SocietySchema.methods.isLeader = function(userId) {
  return this.leader.toString() === userId.toString();
};

const Society = mongoose.model('Society', SocietySchema);

/**
 * Joi Validation Schema for Input
 */
const SocietyJoiSchema = joi.object({
  name: joi.string().trim().min(3).max(100).required(),
  description: joi.string().min(20).max(1000).required(),
  category: joi.string().valid(
    'Engineering', 'Finance & Technology', 'Arts & Culture',
    'Social Impact', 'Sports', 'Science', 'Health & Wellness', 'Other'
  ).required(),
  tags: joi.array().items(joi.string().max(20)).max(5).default([]),
  isPublic: joi.boolean().default(true),
  leader: joi.string().regex(/^[0-9a-fA-F]{24}$/).required() // Must be valid ObjectId
});

module.exports = { Society, SocietyJoiSchema };
