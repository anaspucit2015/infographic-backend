import Infographic from '../models/infographic.model.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/apiError.js';

export const createInfographic = catchAsync(async (req, res, next) => {
  const { title, description, designState, isPublic, tags, category, template, style } = req.body;


  const newInfographic = await Infographic.create({
    user: req.user._id,
    title,
    description,
    designState: req.body.designState,
    isPublic,
    tags,
    category,
    template,
    style,
  });

  res.status(201).json({
    status: 'success',
    data: {
      infographic: newInfographic,
    },
  });
});

export const getAllInfographics = catchAsync(async (req, res, next) => {
  const infographics = await Infographic.find();

  res.status(200).json({
    status: 'success',
    results: infographics.length,
    data: {
      infographics,
    },
  });
});

export const getInfographic = catchAsync(async (req, res, next) => {
  const infographic = await Infographic.findById(req.params.id);

  if (!infographic) {
    return next(new ApiError(404, 'No infographic found with that ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      infographic,
    },
  });
});

export const updateInfographic = catchAsync(async (req, res, next) => {

  const infographic = await Infographic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!infographic) {
    return next(new ApiError(404, 'No infographic found with that ID'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      infographic,
    },
  });
});

export const checkExportLimit = catchAsync(async (req, res, next) => {
  const infographic = await Infographic.findById(req.params.id);

  if (!infographic) {
    return next(new ApiError(404, 'No infographic found with that ID'));
  }

  if (infographic.exportCount >= 5) {
    return next(new ApiError(403, 'You have reached the export limit for this infographic. Please upgrade to a paid plan to continue exporting.'));
  }

  res.status(200).json({
    status: 'success',
    message: 'You can export your infographic.',
  });
});

export const exportInfographic = catchAsync(async (req, res, next) => {
  const infographic = await Infographic.findById(req.params.id);

  if (!infographic) {
    return next(new ApiError(404, 'No infographic found with that ID'));
  }

  if (infographic.exportCount >= 5) {
    return next(new ApiError(403, 'You have reached the export limit for this infographic. Please upgrade to a paid plan to continue exporting.'));
  }

  infographic.exportCount += 1;
  await infographic.save();

  res.status(200).json({
    status: 'success',
    message: 'Infographic exported successfully.',
    data: {
      infographic,
    },
  });
});

export const deleteInfographic = catchAsync(async (req, res, next) => {
  const infographic = await Infographic.findByIdAndDelete(req.params.id);

  if (!infographic) {
    return next(new ApiError(404, 'No infographic found with that ID'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getUserInfographics = catchAsync(async (req, res, next) => {
  const infographics = await Infographic.find({ user: req.params.userId });

  res.status(200).json({
    status: 'success',
    results: infographics.length,
    data: {
      infographics,
    },
  });
});