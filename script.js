// Get the display element
const display = document.getElementById('display');

// Holds the current input/expression typed by the user
let expression = '';

// Function to update the display area
function updateDisplay() {
  display.textContent = expression || '0'; // Show '0' if expression is empty
}

// Function to append a clicked or typed value to the expression
function appendValue(value) {
  const lastChar = expression.slice(-1); // Last character entered

  // Handle π (pi)
  if (value === 'π') {
    // Automatically add * if π follows a number or parenthesis
    if (/\d|\)/.test(lastChar)) expression += '*';
    expression += 'π';
  }

  // Handle square root symbol √
  else if (value === '√') {
    // Add * if √ follows number, π, or closing parenthesis
    if (/\d|\)|π/.test(lastChar)) expression += '*';
    expression += '√';
  }

  // Handle percentage symbol
  else if (value === '%') {
    expression += '%';
  }

  // Handle normal numbers or operators
  else {
    // Insert * automatically if number comes after π
    if (/\d/.test(value) && /π/.test(lastChar)) {
      expression += '*';
    }
    expression += value;
  }

  updateDisplay(); // Refresh screen
}

// Clear all input (AC button)
function clearAll() {
  expression = '';
  updateDisplay();
}

//  Delete the last character (DEL button)
function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Evaluate the current expression (when = pressed or Enter key)
function evaluateExpression() {
  try {
    // Replace symbols with valid JavaScript expressions
    let evalExpr = expression.replace(/π/g, 'Math.PI');
    evalExpr = evalExpr.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
    evalExpr = evalExpr.replace(/√\(/g, 'Math.sqrt(');
    // Safely evaluate using Function constructor
    const result = Function('"use strict";return (' + evalExpr + ')')();

    // Convert result to string for display
    expression = result.toString();
    updateDisplay();
  } catch {
    // Display 'Error' if invalid input or calculation
    expression = '';
    display.textContent = 'Error';
  }
}

//   click events to all buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('ac')) clearAll(); // AC button
    else if (button.classList.contains('del')) deleteLast(); // DEL button
    else if (button.id === 'equals') evaluateExpression(); // = button
    else if (button.hasAttribute('data-value')) appendValue(button.getAttribute('data-value')); // All others
  });
});

// Add keyboard support (NEW FEATURE)
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Allow numbers, operators, parentheses, and decimal
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '%', '(', ')'].includes(key)) {
    appendValue(key);
  }

  // Enter or = key → evaluate
  else if (key === 'Enter' || key === '=') {
    evaluateExpression();
  }

  // Backspace key → delete last
  else if (key === 'Backspace') {
    deleteLast();
  }

  // Escape key → clear all
  else if (key === 'Escape') {
    clearAll();
  }

  // Shortcut for π (press 'p' or 'P')
  else if (key.toLowerCase() === 'p') {
    appendValue('π');
  }

  // Shortcut for √ (press 'r' for root)
  else if (key.toLowerCase() === 'r') {
    appendValue('√');
  }
});

//  Show initial display on load
updateDisplay();