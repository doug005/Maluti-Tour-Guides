import React from 'react';

function FormField({ id, label, error, describedBy, description, children }) {
  const errorId = `${id}-error`;
  const describedByIds = [children.props['aria-describedby'], describedBy, error ? errorId : '']
    .filter(Boolean)
    .join(' ');
  const control = React.cloneElement(children, {
    id,
    'aria-describedby': describedByIds || undefined,
    'aria-invalid': Boolean(error),
  });

  return (
    <div className={`form-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {control}
      {description}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}

export default FormField;