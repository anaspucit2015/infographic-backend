class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'No content') {
    return new ApiResponse(204, null, message);
  }

  static send(res, statusCode, data, message) {
    const response = new ApiResponse(statusCode, data, message);
    return res.status(statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  }

  static sendSuccess(res, data, message = 'Success') {
    return ApiResponse.send(res, 200, data, message);
  }

  static sendCreated(res, data, message = 'Resource created successfully') {
    return ApiResponse.send(res, 201, data, message);
  }

  static sendNoContent(res, message = 'No content') {
    return ApiResponse.send(res, 204, null, message);
  }

  static sendError(res, error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    
    // In development, include the error stack
    const response = {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };

    return res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
