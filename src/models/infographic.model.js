import mongoose from 'mongoose';

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
    designState: {
      type: String,
      required: [true, 'Please provide content for the infographic'],
      validate: {
        validator: function (value) {
          if (typeof value !== 'string') {
            return false;
          }
          try {
            const parsed = JSON.parse(value);
            return typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0;
          } catch (error) {
            return false;
          }
        },
        message: 'Please provide a valid non-empty design state.',
      },
    },
    exportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
infographicSchema.index({ user: 1 });

// Populate user data when querying
infographicSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email photo',
  });
  next();
});

const Infographic = mongoose.model('Infographic', infographicSchema);

export default Infographic;
