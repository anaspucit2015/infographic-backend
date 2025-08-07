const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Subscription must belong to a user'],
      unique: true,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'paused'],
      default: 'active',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'manual'],
    },
    paymentId: String, // ID from payment provider
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: Date,
    trialStart: Date,
    trialEnd: Date,
    features: {
      maxInfographics: {
        type: Number,
        default: 10, // Free tier limit
      },
      maxTeamMembers: {
        type: Number,
        default: 1,
      },
      maxFileSize: {
        type: Number, // in MB
        default: 10,
      },
      customTemplates: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      analytics: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

// Virtual for checking if subscription is active
subscriptionSchema.virtual('isActive').get(function () {
  return (
    this.status === 'active' ||
    this.status === 'trialing' ||
    (this.status === 'canceled' && new Date(this.currentPeriodEnd) > new Date())
  );
});

// Virtual for checking if subscription is in trial
subscriptionSchema.virtual('isTrial').get(function () {
  return this.status === 'trialing' && new Date(this.trialEnd) > new Date();
});

// Populate user data when querying
subscriptionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email photo',
  });
  next();
});

// Static method to get subscription features by plan
subscriptionSchema.statics.getPlanFeatures = function (plan) {
  const plans = {
    free: {
      maxInfographics: 10,
      maxTeamMembers: 1,
      maxFileSize: 10,
      customTemplates: false,
      prioritySupport: false,
      analytics: false,
    },
    basic: {
      maxInfographics: 50,
      maxTeamMembers: 3,
      maxFileSize: 20,
      customTemplates: true,
      prioritySupport: false,
      analytics: true,
    },
    pro: {
      maxInfographics: 200,
      maxTeamMembers: 10,
      maxFileSize: 50,
      customTemplates: true,
      prioritySupport: true,
      analytics: true,
    },
    enterprise: {
      maxInfographics: 1000,
      maxTeamMembers: 100,
      maxFileSize: 100,
      customTemplates: true,
      prioritySupport: true,
      analytics: true,
    },
  };

  return plans[plan] || plans.free;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
