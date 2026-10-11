import React, { useEffect, useRef, useState } from 'react';
import attractions from '../data/attractions';
import contact from '../data/contact';
import FormField from './FormField';
import {
  getTodayLocalDate,
  getTrimmedMessageLength,
  MAX_NAME_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  validateField,
  validateForm,
  validateDestination,
} from '../utils/formValidation';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  destination: '',
  visitors: '1',
  visitDate: '',
  message: '',
};

const fieldLabels = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  destination: 'Destination',
  visitors: 'Number of visitors',
  visitDate: 'Preferred visit date',
  message: 'Visit message',
};

const rejectedCharacterErrors = {
  fullName: 'Only letters, spaces, apostrophes, and hyphens are accepted.',
  phone: 'Letters are not accepted.',
};
const rejectedInputErrors = {
  ...rejectedCharacterErrors,
  fullNameLength: 'Your name must be 25 characters or fewer.',
};

function EnquiryForm({ selectedDestination }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    destination: selectedDestination || '',
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);
  const [focusFirstInvalid, setFocusFirstInvalid] = useState(false);
  const formRef = useRef(null);
  const today = getTodayLocalDate();
  const messageLength = getTrimmedMessageLength(form.message);

  useEffect(() => {
    if (!selectedDestination) return;

    setForm((current) => ({ ...current, destination: selectedDestination }));
    setErrors((current) => {
      if (!current.destination) return current;
      const error = validateDestination(selectedDestination, attractions);
      const nextErrors = { ...current };
      if (error) nextErrors.destination = error;
      else delete nextErrors.destination;
      return nextErrors;
    });
    setSuccess(false);
    setShowErrorSummary(false);
  }, [selectedDestination]);

  useEffect(() => {
    if (!focusFirstInvalid) return;

    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    setFocusFirstInvalid(false);
  }, [focusFirstInvalid]);

  function handleChange(event) {
    const { name, value } = event.target;
    const cleanedValue = name === 'fullName'
      ? sanitizeNameInput(value)
      : name === 'phone'
        ? sanitizePhoneInput(value)
        : value;
    const rejectedCharacters = cleanedValue !== value;
    const attemptedNameIsTooLong = name === 'fullName'
      && Array.from(value.replace(/[^\p{L}\p{M} '\u2019\u02bc\-‐‑]/gu, '')).length > MAX_NAME_LENGTH;
    setForm((current) => ({ ...current, [name]: cleanedValue }));

    if (attemptedNameIsTooLong || rejectedCharacters) {
      setTouched((current) => ({ ...current, [name]: true }));
      const error = attemptedNameIsTooLong
        ? rejectedInputErrors.fullNameLength
        : rejectedCharacterErrors[name];
      setErrors((current) => ({ ...current, [name]: error }));
    } else if (touched[name] || errors[name]) {
      const error = validateField(name, cleanedValue, attractions, today);
      setErrors((current) => {
        const nextErrors = { ...current };
        if (error) nextErrors[name] = error;
        else delete nextErrors[name];
        return nextErrors;
      });
    }

    setSuccess(false);
    setShowErrorSummary(false);
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    const error = validateField(name, value, attractions, today);

    if (Object.values(rejectedInputErrors).includes(errors[name]) && !error) return;

    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => {
      const nextErrors = { ...current };
      if (error) nextErrors[name] = error;
      else delete nextErrors[name];
      return nextErrors;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm(form, attractions, today);
    Object.keys(rejectedCharacterErrors).forEach((fieldName) => {
      if (Object.values(rejectedInputErrors).includes(errors[fieldName]) && !nextErrors[fieldName]) {
        nextErrors[fieldName] = errors[fieldName];
      }
    });
    const hasErrors = Object.keys(nextErrors).length > 0;

    setErrors(nextErrors);
    setTouched(Object.keys(initialForm).reduce((fields, fieldName) => ({
      ...fields,
      [fieldName]: true,
    }), {}));

    if (hasErrors) {
      setShowErrorSummary(true);
      setSuccess(false);
      setFocusFirstInvalid(true);
      return;
    }

    setForm({ ...initialForm });
    setErrors({});
    setTouched({});
    setShowErrorSummary(false);
    setSuccess(true);
    setFocusFirstInvalid(false);
  }

  return (
    <section className="enquiry-section section-pad" id="enquiries">
      <div className="page-shell enquiry-grid">
        <div className="enquiry-copy">
          <p className="eyebrow"><span /> YOUR JOURNEY STARTS HERE</p>
          <h2>Let’s make it<br /><em>your own.</em></h2>
          <p>Tell us what you’re dreaming of.</p>
          <div className="enquiry-note"><span aria-hidden="true">✳</span><p>Local conditions can change quickly. Check access, weather and estimated costs with providers before travelling.</p></div>
          <div className="enquiry-contacts">
            <h3>Contact the guides</h3>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            <a href={`tel:${contact.alternatePhone.replace(/\s/g, '')}`}>{contact.alternatePhone}</a>
            
          </div>
        </div>

        <form className="enquiry-form" ref={formRef} onSubmit={handleSubmit} noValidate>
          {showErrorSummary && (
            <div className="form-error-summary" role="alert" aria-labelledby="form-error-title">
              <strong id="form-error-title">Please check the highlighted fields.</strong>
              <ul>
                {Object.entries(errors).map(([fieldName, error]) => (
                  <li key={fieldName}>{fieldLabels[fieldName]}: {error}</li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <div className="form-success" role="status">
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Your enquiry has been submitted successfully.</strong>
                <p>This demo form does not send enquiries. The sample contact details are fictional.</p>
              </div>
            </div>
          )}

          <div className="form-row">
            <FormField id="fullName" label="Full name" error={errors.fullName}>
              <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur} autoComplete="name" placeholder="Your name" required />
            </FormField>
            <FormField id="email" label="Email address" error={errors.email}>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" placeholder="you@example.com" required />
            </FormField>
          </div>

          <div className="form-row">
            <FormField id="phone" label="Phone number" error={errors.phone}>
              <input id="phone" type="tel" inputMode="tel" name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" placeholder="+266 1234 5678" required />
            </FormField>
            <FormField id="destination" label="Selected destination" error={errors.destination}>
              <select id="destination" name="destination" value={form.destination} onChange={handleChange} onBlur={handleBlur} required>
                <option value="">Choose a place</option>
                {attractions.map((attraction) => <option key={attraction.id} value={attraction.name}>{attraction.name}</option>)}
              </select>
            </FormField>
          </div>

          <div className="form-row form-row--short">
            <FormField id="visitors" label="Number of visitors" error={errors.visitors}>
              <input id="visitors" type="text" inputMode="numeric" name="visitors" value={form.visitors} onChange={handleChange} onBlur={handleBlur} required />
            </FormField>
            <FormField id="visitDate" label="Preferred visit date" error={errors.visitDate}>
              <input id="visitDate" type="date" name="visitDate" min={today} value={form.visitDate} onChange={handleChange} onBlur={handleBlur} required />
            </FormField>
          </div>

          <FormField
            id="message"
            label="A little about your visit"
            error={errors.message}
            describedBy="message-counter"
            description={<span className="character-count" id="message-counter">{messageLength} / 1,000 characters (minimum 10)</span>}
          >
            <textarea id="message" name="message" rows="3" value={form.message} onChange={handleChange} onBlur={handleBlur} placeholder="What would make this trip special?" required />
          </FormField>

          <button className="button button--dark form-submit" type="submit">Review enquiry <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </section>
  );
}

export default EnquiryForm;