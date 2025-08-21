/**
 * Testes básicos para verificar TypeScript no Jest
 */

describe('TypeScript Math Utils', () => {
  test('addition with types should work', () => {
    const add = (a: number, b: number): number => a + b;
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('subtraction with types should work', () => {
    const subtract = (a: number, b: number): number => a - b;
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(10, 5)).toBe(5);
    expect(subtract(0, 0)).toBe(0);
  });

  test('string operations with types should work', () => {
    const concat = (a: string, b: string): string => `${a} ${b}`;
    expect(concat('Hello', 'World')).toBe('Hello World');
  });

  test('async with types should work', async () => {
    const asyncAdd = async (a: number, b: number): Promise<number> => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(a + b), 10);
      });
    };

    const result = await asyncAdd(5, 7);
    expect(result).toBe(12);
  });
});