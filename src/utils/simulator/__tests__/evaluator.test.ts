// src/utils/simulator/__tests__/evaluator.test.ts

import { evaluateExpression } from "../evaluator";

describe("Expression Evaluator", () => {
  it("should evaluate simple comparisons", () => {
    const ctx = { variables: { x: 10 } };
    expect(evaluateExpression("x > 5", ctx)).toBe(true);
    expect(evaluateExpression("x < 5", ctx)).toBe(false);
    expect(evaluateExpression("x === 10", ctx)).toBe(true);
  });

  it("should evaluate logical operators", () => {
    const ctx = { variables: { x: 10, y: 5 } };
    expect(evaluateExpression("x > 5 && y < 10", ctx)).toBe(true);
    expect(evaluateExpression("x > 15 || y < 10", ctx)).toBe(true);
    expect(evaluateExpression("x > 15 && y < 10", ctx)).toBe(false);
  });

  it("should handle string comparisons", () => {
    const ctx = { variables: { status: "active" } };
    expect(evaluateExpression('status === "active"', ctx)).toBe(true);
    expect(evaluateExpression('status === "inactive"', ctx)).toBe(false);
  });

  it("should handle missing variables", () => {
    const ctx = { variables: {} };
    expect(evaluateExpression("missing_var > 5", ctx)).toBeFalsy();
  });

  it("should handle complex expressions", () => {
    const ctx = { variables: { balance: 100, threshold: 50 } };
    expect(evaluateExpression("balance > threshold && balance < 200", ctx)).toBe(true);
  });
});
