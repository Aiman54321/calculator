const display = document.getElementById('display');

let expression = '0';

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number(value.toFixed(10));
  return String(rounded);
}

function updateDisplay() {
  display.textContent = expression;
}

function clearCalculator() {
  expression = '0';
  updateDisplay();
}

function deleteLastChar() {
  if (expression === 'Error') {
    clearCalculator();
    return;
  }

  if (expression.length <= 1) {
    expression = '0';
  } else {
    expression = expression.slice(0, -1);
  }

  updateDisplay();
}

function appendNumber(value) {
  if (expression === 'Error') {
    expression = '0';
  }

  if (value === '.') {
    const lastToken = expression.split(/[+\-*/]/).pop();
    if (lastToken.includes('.')) {
      return;
    }

    if (expression === '0' || /[+\-*/]$/.test(expression)) {
      expression += '0.';
    } else {
      expression += '.';
    }

    updateDisplay();
    return;
  }

  if (expression === '0') {
    expression = value;
  } else {
    expression += value;
  }

  updateDisplay();
}

function appendOperator(operator) {
  if (expression === 'Error') {
    return;
  }

  if (expression === '0') {
    if (operator === '-') {
      expression = '-';
    }
    updateDisplay();
    return;
  }

  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  updateDisplay();
}

function evaluateExpression(expr) {
  const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').trim();

  if (!sanitized || /[+\-*/]$/.test(sanitized)) {
    return 'Error';
  }

  const validPattern = /^-?(?:\d+\.?\d*|\.\d+)(?:[+\-*/]-?(?:\d+\.?\d*|\.\d+))*$/;
  if (!validPattern.test(sanitized)) {
    return 'Error';
  }

  try {
    const result = Function(`"use strict"; return (${sanitized});`)();
    if (!Number.isFinite(result)) {
      return 'Error';
    }
    return formatResult(result);
  } catch (error) {
    return 'Error';
  }
}

function evaluate() {
  const result = evaluateExpression(expression);
  expression = result;
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === 'clear') {
    clearCalculator();
    return;
  }

  if (action === 'delete') {
    deleteLastChar();
    return;
  }

  if (action === 'equals') {
    evaluate();
    return;
  }

  if (value === '.') {
    appendNumber('.');
    return;
  }

  if (/\d/.test(value)) {
    appendNumber(value);
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    appendOperator(value);
  }
}

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => button.addEventListener('click', handleButtonClick));

if (typeof module !== 'undefined') {
  module.exports = { evaluateExpression, formatResult };
}

updateDisplay();
