import React from 'react';
import { FormComponent, WizardStep } from '../types';

interface FormRendererProps {
  wizardSteps: WizardStep[];
  formValues: { [key: string]: any };
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onFormSubmit: (data: { [key: string]: any }) => void;
  onValueChange: (key: string, value: any) => void;
  readonly?: boolean;
  preview?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  wizardSteps,
  formValues,
  currentStepIndex,
  onStepChange,
  onFormSubmit,
  onValueChange,
  readonly = false,
  preview = false
}) => {
  const currentStep = wizardSteps[currentStepIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formValues);
  };

  const renderComponent = (component: FormComponent) => {
    const value = formValues[component.key] || '';

    switch (component.type) {
      case 'textfield':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'email':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="email"
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <textarea
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
              rows={4}
            />
          </div>
        );

      case 'number':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="number"
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'select':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <select
              className="form-select"
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            >
              <option value="">Choose...</option>
              {component.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <div>
              {component.options?.map((option, idx) => (
                <div key={idx} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name={component.key}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onValueChange(component.key, e.target.value)}
                    disabled={readonly}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={component.id} className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={!!value}
                onChange={(e) => onValueChange(component.key, e.target.checked)}
                disabled={readonly}
              />
              <label className="form-check-label">
                {component.label}
                {component.required && <span className="text-danger">*</span>}
              </label>
            </div>
          </div>
        );

      case 'button':
        return (
          <div key={component.id} className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              disabled={readonly}
            >
              {component.label}
            </button>
          </div>
        );

      case 'columns':
        return (
          <div key={component.id} className="mb-3">
            {component.label && (
              <label className="form-label fw-bold">{component.label}</label>
            )}
            <div className="row">
              {component.columns?.map((column: any, idx: number) => {
                // Support both FormCraft structure (column.components) and FormIO structure (array of components)
                const columnComponents = Array.isArray(column) ? column : column.components || [];
                const colWidth = Array.isArray(column) ? 6 : (column.width || 6);

                return (
                  <div key={idx} className={`col-md-${colWidth}`}>
                    {columnComponents.map((subComponent: any) =>
                      renderComponent(subComponent)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'panel':
        return (
          <div key={component.id} className="mb-3">
            <div className="card">
              {component.title && (
                <div className="card-header">
                  <h6 className="mb-0">{component.title}</h6>
                </div>
              )}
              <div className="card-body">
                {component.label && component.label !== component.title && (
                  <p className="card-text">{component.label}</p>
                )}
                {component.components?.map((subComponent: any) =>
                  renderComponent(subComponent)
                )}
              </div>
            </div>
          </div>
        );

      case 'fieldset':
        return (
          <div key={component.id} className="mb-3">
            <fieldset className="border p-3 rounded">
              {component.legend && (
                <legend className="h6 fw-bold px-2">{component.legend}</legend>
              )}
              {component.label && !component.legend && (
                <div className="fw-bold mb-2">{component.label}</div>
              )}
              {component.components?.map((subComponent: any) =>
                renderComponent(subComponent)
              )}
            </fieldset>
          </div>
        );

      case 'well':
        return (
          <div key={component.id} className="mb-3">
            <div className="p-3 bg-light border rounded">
              {component.label && (
                <div className="fw-bold mb-2">{component.label}</div>
              )}
              {component.components?.map((subComponent: any) =>
                renderComponent(subComponent)
              )}
            </div>
          </div>
        );

      case 'content':
      case 'htmlelement':
        return (
          <div key={component.id} className="mb-3">
            {component.label && (
              <label className="form-label fw-bold">{component.label}</label>
            )}
            <div
              className="p-2 border rounded"
              dangerouslySetInnerHTML={{ __html: component.content || component.html || component.label || 'HTML Content' }}
            />
          </div>
        );

      case 'hidden':
        return (
          <input
            key={component.id}
            type="hidden"
            name={component.key}
            value={formValues[component.key] || component.defaultValue || ''}
          />
        );

      case 'submit':
        return (
          <div key={component.id} className="mb-3">
            <button
              type="submit"
              className="btn btn-success"
              disabled={readonly}
            >
              {component.label || 'Submit'}
            </button>
          </div>
        );

      case 'reset':
        return (
          <div key={component.id} className="mb-3">
            <button
              type="reset"
              className="btn btn-secondary"
              disabled={readonly}
            >
              {component.label || 'Reset'}
            </button>
          </div>
        );

      case 'password':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="password"
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'date':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="date"
              className="form-control"
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'time':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="time"
              className="form-control"
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'url':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="url"
              className="form-control"
              placeholder={component.placeholder}
              value={value}
              onChange={(e) => onValueChange(component.key, e.target.value)}
              required={component.required}
              disabled={readonly}
            />
          </div>
        );

      case 'file':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => onValueChange(component.key, e.target.files?.[0] || null)}
              required={component.required}
              disabled={readonly}
              multiple={component.multiple}
            />
          </div>
        );

      case 'selectboxes':
        return (
          <div key={component.id} className="mb-3">
            <label className="form-label">
              {component.label}
              {component.required && <span className="text-danger">*</span>}
            </label>
            <div>
              {component.options?.map((option, idx) => (
                <div key={idx} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name={component.key}
                    value={option}
                    checked={Array.isArray(value) ? value.includes(option) : false}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      onValueChange(component.key, newValues);
                    }}
                    disabled={readonly}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={component.id} className="mb-3 p-3 bg-light border rounded">
            <small className="text-muted">
              Component type "{component.type}" not implemented
            </small>
          </div>
        );
    }
  };

  if (!currentStep) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No form steps available</p>
      </div>
    );
  }

  // Multi-step layout with wizard menu
  if (wizardSteps.length > 1) {
    return (
      <div className="d-flex h-100">
        {/* Wizard Steps Menu - Left Side */}
        <div className="bg-light border-end" style={{ width: '280px' }}>
          <div className="p-3 h-100">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-list-ol me-2"></i>Form Steps
            </h6>
            <div className="list-group">
              {wizardSteps.map((step, idx) => (
                <button
                  key={step.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    currentStepIndex === idx ? 'active' : ''
                  }`}
                  onClick={() => onStepChange(idx)}
                  disabled={readonly}
                >
                  <div>
                    <span className="badge bg-primary rounded-pill me-2">
                      {idx + 1}
                    </span>
                    {step.title}
                  </div>
                  <small className={`${currentStepIndex === idx ? 'text-white-50' : 'text-muted'}`}>
                    {step.components.length} components
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content - Right Side */}
        <div className="flex-fill overflow-auto">
          <div className="container-fluid p-4">
            <div className="bg-white p-4 rounded shadow-sm border" style={{ minHeight: '500px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-0">{currentStep.title}</h4>
                  {preview && (
                    <div className="d-flex align-items-center mt-2">
                      <span className="badge bg-success me-2">
                        <i className="bi bi-eye me-1"></i>Preview Mode Active
                      </span>
                      <small className="text-muted">
                        Form is interactive - you can fill it out and test functionality
                      </small>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="badge bg-primary me-2">
                      Step {currentStepIndex + 1}: {currentStep.title}
                    </span>
                    <small className="text-muted">
                      Fill out this step and navigate using the menu or buttons below
                    </small>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {currentStep.components.map(renderComponent)}

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => onStepChange(currentStepIndex - 1)}
                    disabled={currentStepIndex === 0 || readonly}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Previous
                  </button>

                  {currentStepIndex < wizardSteps.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => onStepChange(currentStepIndex + 1)}
                      disabled={readonly}
                    >
                      Next<i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={readonly}
                    >
                      <i className="bi bi-check-circle me-2"></i>Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single step layout (original)
  return (
    <div className="formcraft-renderer p-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-4">{currentStep.title}</h4>

              <form onSubmit={handleSubmit}>
                {currentStep.components.map(renderComponent)}

                <div className="d-flex justify-content-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={readonly}
                  >
                    <i className="bi bi-check-circle me-2"></i>Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;