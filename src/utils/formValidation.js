export function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTrimmedMessageLength(value) {
  return Array.from(value.trim()).length;
}

export const MAX_NAME_LENGTH = 25;

export function sanitizeNameInput(value) {
  const allowedCharacters = value.replace(/[^\p{L}\p{M} '\u2019\u02bc\-‐‑]/gu, '');
  return Array.from(allowedCharacters).slice(0, MAX_NAME_LENGTH).join('');
}

export function sanitizePhoneInput(value) {
  const allowedCharacters = value.replace(/[^0-9\s()+-]/g, '');
  let plusAlreadyUsed = false;

  return allowedCharacters.replace(/\+/g, (plus, index, input) => {
    const isLeadingPlus = !input.slice(0, index).trim();
    if (!isLeadingPlus || plusAlreadyUsed) return '';
    plusAlreadyUsed = true;
    return plus;
  });
}

export function validateName(value) {
  const name = value.trim();
  if (!name) return 'Please enter your full name.';
  if (Array.from(name).length > MAX_NAME_LENGTH) return 'Your name must be 25 characters or fewer.';
  if (!/^[\p{L}\p{M}]+(?:(?: +|['\u2019\u02bc\-‐‑])[\p{L}\p{M}]+)*$/u.test(name)) {
    return 'Use international letters, spaces, apostrophes, and hyphens only.';
  }
  return '';
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Please enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Enter an email address in the format name@example.com.';
  }
  return '';
}

export function validatePhone(value) {
  const phone = value.trim();
  if (!phone) return 'Please enter a contact number.';
  if (!/^\+?[0-9\s()-]+$/.test(phone) || /\(\s*\)/.test(phone)) {
    return 'Use digits, spaces, hyphens, parentheses, and an optional leading + only.';
  }

  let openParentheses = 0;
  for (const character of phone) {
    if (character === '(') openParentheses += 1;
    if (character === ')') {
      openParentheses -= 1;
      if (openParentheses < 0) return 'Check that your parentheses are paired.';
    }
  }
  if (openParentheses !== 0) return 'Check that your parentheses are paired.';

  const digitCount = phone.replace(/\D/g, '').length;
  if (digitCount < 7 || digitCount > 15) {
    return 'Enter a phone number with 7 to 15 digits.';
  }
  return '';
}

export function validateDestination(value, attractions) {
  if (!value || !attractions.some((attraction) => attraction.name === value)) {
    return 'Please select a valid destination.';
  }
  return '';
}

export function validateVisitors(value) {
  if (!value.trim()) return 'Please enter the number of visitors.';
  if (!/^\d+$/.test(value)) return 'Enter a whole number of visitors.';

  const visitorCount = Number(value);
  if (visitorCount < 1 || visitorCount > 100) {
    return 'Enter a number of visitors from 1 to 100.';
  }
  return '';
}

export function validateVisitDate(value, today = getTodayLocalDate()) {
  if (!value) return 'Please choose a preferred visit date.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Enter a valid visit date.';
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(0);
  parsedDate.setFullYear(year, month - 1, day);
  if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) {
    return 'Enter a valid visit date.';
  }
  if (value < today) return 'Choose today or a future date.';
  return '';
}

export function validateMessage(value) {
  const message = value.trim();
  const length = getTrimmedMessageLength(value);
  if (!message) return 'Please tell us a little about your visit.';
  if (length < 10) return 'Please enter at least 10 characters.';
  if (length > 1000) return 'Keep your message to 1,000 characters or fewer.';
  return '';
}

export function validateField(fieldName, value, attractions, today = getTodayLocalDate()) {
  const validators = {
    fullName: validateName,
    email: validateEmail,
    phone: validatePhone,
    destination: (fieldValue) => validateDestination(fieldValue, attractions),
    visitors: validateVisitors,
    visitDate: (fieldValue) => validateVisitDate(fieldValue, today),
    message: validateMessage,
  };

  return validators[fieldName] ? validators[fieldName](value) : '';
}

export function validateForm(form, attractions, today = getTodayLocalDate()) {
  const errors = {};
  Object.keys(form).forEach((fieldName) => {
    const error = validateField(fieldName, form[fieldName], attractions, today);
    if (error) errors[fieldName] = error;
  });
  return errors;
}