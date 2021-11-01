const { endpointWrapper } = require("../utils");

describe("endpointWrapper()", () => {
  test("runs inner function with req, res and next", async () => {
    const req = {};
    const res = {};
    const mockNext = jest.fn();
    const mockEndpoint = jest.fn(() => Promise.resolve());

    await endpointWrapper(mockEndpoint)(req, res, mockNext);

    expect(mockEndpoint).toHaveBeenCalledTimes(1);
    expect(mockEndpoint).toHaveBeenCalledWith(req, res, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
  test("if the endpoint raises an error then next is called with that error", async () => {
    const req = {};
    const res = {};
    const mockNext = jest.fn();
    const error = { msg: "error!" };
    const mockEndpoint = jest.fn(async () => {
      throw error;
    });

    await endpointWrapper(mockEndpoint)(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
