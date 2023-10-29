const {catchAsync}= require('../../src/util');

describe('catchAsync', () => {
  it('should call the provided function with req, res, and next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const asyncFunction = jest.fn().mockResolvedValue();
    const wrappedFunction = catchAsync(asyncFunction);

    await wrappedFunction(req, res, next);

    expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
    expect(asyncFunction).toHaveBeenCalledTimes(1);
  });

  it('should call the "next" function if an error occurs', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    const asyncFunction = jest.fn().mockRejectedValue(new Error('Test Error'));
    const wrappedFunction = catchAsync(asyncFunction);

    await wrappedFunction(req, res, next);

    expect(asyncFunction).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
