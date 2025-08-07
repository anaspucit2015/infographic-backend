const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
    infographic: {
      type: mongoose.Schema.ObjectId,
      ref: 'Infographic',
      required: [true, 'Comment must belong to an infographic'],
    },
    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
commentSchema.index({ infographic: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id',
});

// Virtual for likes count
commentSchema.virtual('likesCount').get(function () {
  return this.likes?.length || 0;
});

// Populate user data when querying
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
