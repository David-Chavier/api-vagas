class Calculadora {
  public somar(val1: number, val2: number) {
    return val1 + val2;
  }
  public multiplicar(val1: number, val2: number) {
    return val1 * val2;
  }
}

describe("Testes do componente Calculadora", () => {
  const createSut = () => {
    return new Calculadora();
  };
  test("deve retornar 2 ao somar 1 e 1", () => {
    const sut = createSut();
    const result = sut.somar(1, 1);
    expect(result).toBe(2);
  });
  test("deve retornar 42 ao multiplicar 6 e 7", () => {
    const sut = createSut();
    const result = sut.multiplicar(6, 7);
    expect(result).toBe(42);
    expect(result).toEqual(42);
  });
});
