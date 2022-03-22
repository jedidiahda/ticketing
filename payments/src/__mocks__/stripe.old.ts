export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}), //return a promise which can resolve with empty itself

  }
}