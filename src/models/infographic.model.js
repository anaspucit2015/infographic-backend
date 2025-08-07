const mongoose = require('mongoose');

const infographicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Infographic must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide content for the infographic'],
    },
    thumbnail: {
      type: String,
      default: 'default-infographic.jpg',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    category: {
      type: String,
      enum: ['business', 'education', 'health', 'technology', 'marketing', 'other'],
      default: 'other',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
    downloads: {
      type: Number,
      default: 0,
    },
    template: {
      type: String,
      default: 'default',
    },
    style: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
infographicSchema.index({ user: 1 });
infographicSchema.index({ title: 'text', description: 'text', tags: 'text' });
infographicSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for comments
infographicSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'infographic',
  localField: '_id',
});

// Virtual for likes count
infographicSchema.virtual('likesCount').get(function () {
  return this.likes?.length || 0;
});

// Populate user data when querying
infographicSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email photo',
  });
  next();
});

const Infographic = mongoose.model('Infographic', infographicSchema);

module.exports = Infographic;
