/**
 * Testes básicos em JavaScript
 */

describe('Math Utils', () => {
  test('addition should work', () => {
    const add = (a, b) => a + b;
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('subtraction should work', () => {
    const subtract = (a, b) => a - b;
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(10, 5)).toBe(5);
    expect(subtract(0, 0)).toBe(0);
  });

  test('multiplication should work', () => {
    const multiply = (a, b) => a * b;
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(-2, 3)).toBe(-6);
  });

  test('should handle async operations', async () => {
    const asyncAdd = async (a, b) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(a + b), 10);
      });
    };

    const result = await asyncAdd(5, 7);
    expect(result).toBe(12);
  });
});