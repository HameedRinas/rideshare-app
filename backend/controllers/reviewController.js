const { Review, User, Trip } = require('../models');

const reviewSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  type: {
    type: String,
    enum: ['driver', 'rider'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);

const reviewController = {
  async createReview(req, res, next) {
    try {
      const { toUserId, tripId, rating, comment, type } = req.body;

      // Check if review already exists
      const existingReview = await Review.findOne({
        fromUser: req.user._id,
        toUser: toUserId,
        trip: tripId
      });

      if (existingReview) {
        return res.status(400).json({ error: 'You already reviewed this user' });
      }

      const review = new Review({
        fromUser: req.user._id,
        toUser: toUserId,
        trip: tripId,
        rating,
        comment,
        type
      });

      await review.save();

      // Update user's average rating
      const userReviews = await Review.find({ toUser: toUserId });
      const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      
      await User.findByIdAndUpdate(toUserId, { rating: avgRating });

      res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserReviews(req, res, next) {
    try {
      const { userId } = req.params;

      const reviews = await Review.find({ toUser: userId })
        .populate('fromUser', 'name')
        .populate('trip', 'from to date')
        .sort({ createdAt: -1 });

      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reviewController;