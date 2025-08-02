import React, { useState, useRef } from 'react';
import { FormComponent, WizardStep } from '../types';

interface FormBuilderProps {
  wizardSteps: WizardStep[];
  formValues: { [key: string]: any };
  onDataChange: (wizardSteps: WizardStep[], formValues: { [key: string]: any }) => void;
  readonly?: boolean;
}

// Complete component types from original FormCraft
const componentTypes = [
  {
    category: "Basic Input",
    items: [
      { type: "textfield", label: "Text Field", icon: "bi-input-cursor-text" },
      { type: "textarea", label: "Text Area", icon: "bi-textarea" },
      { type: "number", label: "Number", icon: "bi-123" },
      { type: "password", label: "Password", icon: "bi-lock" },
      { type: "email", label: "Email", icon: "bi-envelope" },
      { type: "url", label: "URL", icon: "bi-link" },
      { type: "phone", label: "Phone Number", icon: "bi-telephone" },
      { type: "tags", label: "Tags", icon: "bi-tags" },
      { type: "address", label: "Address", icon: "bi-geo-alt" },
      { type: "date", label: "Date / Time", icon: "bi-calendar" },
      { type: "day", label: "Day", icon: "bi-calendar-day" },
      { type: "time", label: "Time", icon: "bi-clock" },
      { type: "currency", label: "Currency", icon: "bi-currency-dollar" },
      { type: "survey", label: "Survey", icon: "bi-card-checklist" }
    ]
  },
  {
    category: "Advanced",
    items: [
      { type: "signature", label: "Signature", icon: "bi-pencil" },
      { type: "file", label: "File", icon: "bi-file-earmark" },
      { type: "htmlelement", label: "HTML Element", icon: "bi-code" },
      { type: "content", label: "Content", icon: "bi-card-text" },
      { type: "hidden", label: "Hidden", icon: "bi-eye-slash" }
    ]
  },
  {
    category: "Selection",
    items: [
      { type: "select", label: "Select", icon: "bi-menu-button-wide" },
      { type: "radio", label: "Radio", icon: "bi-ui-radios" },
      { type: "selectboxes", label: "Select Boxes", icon: "bi-check2-square" },
      { type: "checkbox", label: "Checkbox", icon: "bi-check-square" }
    ]
  },
  {
    category: "Layout",
    items: [
      { type: "panel", label: "Panel", icon: "bi-layout-sidebar" },
      { type: "table", label: "Table", icon: "bi-table" },
      { type: "columns", label: "Columns", icon: "bi-layout-three-columns" },
      { type: "fieldset", label: "Field Set", icon: "bi-bounding-box" },
      { type: "well", label: "Well", icon: "bi-square" },
      { type: "tabs", label: "Tabs", icon: "bi-folder" }
    ]
  },
  {
    category: "Data",
    items: [
      { type: "datagrid", label: "Data Grid", icon: "bi-grid" },
      { type: "editgrid", label: "Edit Grid", icon: "bi-grid-3x3" },
      { type: "tree", label: "Tree", icon: "bi-diagram-3" }
    ]
  },
  {
    category: "Actions",
    items: [
      { type: "button", label: "Button", icon: "bi-mouse" },
      { type: "submit", label: "Submit", icon: "bi-check-circle" },
      { type: "reset", label: "Reset", icon: "bi-arrow-clockwise" }
    ]
  }
];

const FormBuilder: React.FC<FormBuilderProps> = ({
  wizardSteps,
  formValues,
  onDataChange,
  readonly = false
}) => {
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showComponentsPanel, setShowComponentsPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Basic Input']));
  const [isBuilderMode, setIsBuilderMode] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [propertiesTab, setPropertiesTab] = useState('display');

  // Property panel tabs
  const propertyTabs = [
    { id: 'display', label: 'Display', icon: 'bi-eye' },
    { id: 'data', label: 'Data', icon: 'bi-database' },
    { id: 'validation', label: 'Validation', icon: 'bi-check-circle' },
    { id: 'api', label: 'API', icon: 'bi-cloud' },
    { id: 'conditional', label: 'Conditional', icon: 'bi-code-slash' },
    { id: 'logic', label: 'Logic', icon: 'bi-cpu' }
  ];



  const addStep = () => {
    const newStep: WizardStep = {
      id: `step_${Date.now()}`,
      title: `Step ${wizardSteps.length + 1}`,
      description: '',
      components: []
    };
    const updatedSteps = [...wizardSteps, newStep];
    onDataChange(updatedSteps, formValues);
    setCurrentStepIndex(updatedSteps.length - 1);
  };

  const updateStep = (stepId: string, updates: Partial<WizardStep>) => {
    const updatedSteps = wizardSteps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onDataChange(updatedSteps, formValues);
  };

  const deleteStep = (stepId: string) => {
    const updatedSteps = wizardSteps.filter(step => step.id !== stepId);
    onDataChange(updatedSteps, formValues);
    if (currentStepIndex >= updatedSteps.length) {
      setCurrentStepIndex(Math.max(0, updatedSteps.length - 1));
    }
  };

  const addComponent = (type: string, parentId?: string) => {
    if (readonly) return;

    const newComponent: FormComponent = {
      id: `component_${Date.now()}`,
      type,
      label: `New ${type}`,
      key: `field_${Date.now()}`,
      required: false,
      position: 'top' as const,
      placeholder: !['button', 'submit', 'reset', 'content', 'panel'].includes(type) ? `Enter ${type}` : undefined,
      options: ['select', 'radio', 'selectboxes'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      children: ['panel', 'columns', 'fieldset', 'well', 'tabs'].includes(type) ? [] : undefined,
      rows: type === 'datagrid' ? [] : undefined,
      datagridColumns: type === 'datagrid' ? [] : undefined
    };

    const updatedSteps = [...wizardSteps];
    if (!updatedSteps[currentStepIndex]) {
      updatedSteps[currentStepIndex] = {
        id: `step_${currentStepIndex}`,
        title: `Step ${currentStepIndex + 1}`,
        components: []
      };
    }

    if (parentId) {
      // Add to nested component (panel, columns, etc.)
      const addToNested = (components: FormComponent[]): FormComponent[] => {
        return components.map(comp => {
          if (comp.id === parentId && comp.children) {
            return { ...comp, children: [...comp.children, newComponent] };
          } else if (comp.children) {
            return { ...comp, children: addToNested(comp.children) };
          }
          return comp;
        });
      };
      updatedSteps[currentStepIndex].components = addToNested(updatedSteps[currentStepIndex].components);
    } else {
      updatedSteps[currentStepIndex].components.push(newComponent);
    }

    onDataChange(updatedSteps, formValues);
    setSelectedComponent(newComponent);
  };

  const updateComponent = (componentId: string, updates: Partial<FormComponent>) => {
    const updateNested = (components: FormComponent[]): FormComponent[] => {
      return components.map(comp => {
        if (comp.id === componentId) {
          return { ...comp, ...updates };
        } else if (comp.children) {
          return { ...comp, children: updateNested(comp.children) };
        }
        return comp;
      });
    };

    const updatedSteps = wizardSteps.map(step => ({
      ...step,
      components: updateNested(step.components)
    }));

    onDataChange(updatedSteps, formValues);

    if (selectedComponent?.id === componentId) {
      setSelectedComponent({ ...selectedComponent, ...updates });
    }
  };

  const deleteComponent = (componentId: string) => {
    const deleteNested = (components: FormComponent[]): FormComponent[] => {
      return components.filter(comp => comp.id !== componentId).map(comp => {
        if (comp.children) {
          return { ...comp, children: deleteNested(comp.children) };
        }
        return comp;
      });
    };

    const updatedSteps = wizardSteps.map(step => ({
      ...step,
      components: deleteNested(step.components)
    }));

    onDataChange(updatedSteps, formValues);
    setSelectedComponent(null);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('text/plain', componentType);
    setDraggedComponent(componentType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDraggedComponent(null);

    const componentType = e.dataTransfer.getData('text/plain');
    if (componentType && !readonly) {
      addComponent(componentType, parentId);
    }
  };

  const renderComponent = (component: FormComponent, isNested = false): React.ReactNode => {
    const canHaveChildren = ['panel', 'columns', 'fieldset', 'well', 'tabs'].includes(component.type);

    return (
      <div
        key={component.id}
        className={`border rounded p-3 mb-3 position-relative ${
          selectedComponent?.id === component.id ? 'border-primary bg-light' : ''
        } ${isNested ? 'ms-3' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component);
        }}
        style={{ cursor: 'pointer' }}
        onDrop={canHaveChildren ? (e) => handleDrop(e, component.id) : undefined}
        onDragOver={canHaveChildren ? handleDragOver : undefined}
        onDragEnter={canHaveChildren ? handleDragEnter : undefined}
        onDragLeave={canHaveChildren ? handleDragLeave : undefined}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="d-flex align-items-center">
              <strong>{component.label}</strong>
              <small className="text-muted ms-2">({component.type})</small>
              {component.required && <span className="badge bg-danger ms-2">Required</span>}
              {component.hidden && <span className="badge bg-secondary ms-2">Hidden</span>}
            </div>
            {component.placeholder && (
              <small className="text-muted d-block mt-1">
                Placeholder: {component.placeholder}
              </small>
            )}
            {component.description && (
              <small className="text-muted d-block mt-1">
                {component.description}
              </small>
            )}
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteComponent(component.id);
              }}
              title="Delete component"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        {/* Render nested components */}
        {canHaveChildren && component.children && component.children.length > 0 && (
          <div className="mt-3 border-top pt-3">
            <small className="text-muted d-block mb-2">Nested Components:</small>
            {component.children.map(child => renderComponent(child, true))}
          </div>
        )}

        {/* Drop zone for nested components */}
        {canHaveChildren && (!component.children || component.children.length === 0) && (
          <div className="mt-3 border-2 border-dashed border-secondary p-3 text-center text-muted">
            <i className="bi bi-plus-circle-dotted"></i>
            <small className="d-block mt-1">Drop components here</small>
          </div>
        )}
      </div>
    );
  };

  const currentStep = wizardSteps[currentStepIndex];

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control border-0 fs-5 fw-bold"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group" role="group">
              <button className="btn btn-primary">
                <i className="bi bi-pencil"></i> Builder
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-eye"></i> Preview
              </button>
            </div>
            <button className="btn btn-outline-secondary" onClick={() => setShowComponentsPanel(!showComponentsPanel)}>
              <i className="bi bi-layout-sidebar"></i> Components
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}>
              <i className="bi bi-sliders"></i> Properties
            </button>
          </div>
        </div>
      </nav>

      {/* Steps Section */}
      <div className="bg-light border-bottom">
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">
              <i className="bi bi-list-ol me-2"></i>Form Steps
            </h6>
            <button className="btn btn-primary btn-sm" onClick={addStep} title="Add new form step">
              <i className="bi bi-plus"></i>
            </button>
          </div>

          {wizardSteps.length === 0 ? (
            <div className="text-center text-muted py-2">
              <span className="text-muted me-2">No form steps yet</span>
              <button className="btn btn-outline-primary btn-sm" onClick={addStep}>
                Create First Step
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2 overflow-auto">
              {wizardSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`card cursor-pointer ${index === currentStepIndex ? 'border-primary' : ''}`}
                  style={{ minWidth: '200px' }}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className="card-body py-2 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">Step {index + 1}</small>
                        <div className="fw-bold">{step.title}</div>
                        <small className="text-muted">{step.components.length} components</small>
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item" onClick={() => deleteStep(step.id)}>Delete</button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-fill d-flex">
        {/* Components Panel */}
        {showComponentsPanel && (
          <div className="bg-light border-end" style={{ width: '280px' }}>
            <div className="p-3 border-bottom">
              <h6 className="fw-bold mb-0">Components</h6>
            </div>
            <div className="p-3 h-100 d-flex flex-column">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-puzzle me-2"></i>Form Components
              </h6>

              <div className="flex-fill overflow-auto">
                {componentTypes.map(category => {
                  const isExpanded = expandedCategories.has(category.category);
                  return (
                    <div key={category.category} className="mb-3">
                      <button
                        className="btn btn-light w-100 text-start d-flex justify-content-between align-items-center py-2"
                        onClick={() => {
                          const newExpanded = new Set(expandedCategories);
                          if (isExpanded) {
                            newExpanded.delete(category.category);
                          } else {
                            newExpanded.add(category.category);
                          }
                          setExpandedCategories(newExpanded);
                        }}
                      >
                        <span className="fw-bold small">{category.category}</span>
                        <i className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
                      </button>

                      {isExpanded && (
                        <div className="p-2 bg-white border rounded mt-1">
                          <div className="row g-2">
                            {category.items.map(item => (
                              <div key={item.type} className="col-6">
                                <button
                                  className={`btn btn-outline-primary btn-sm w-100 text-start d-flex align-items-center p-2 ${draggedComponent === item.type ? 'opacity-50' : ''}`}
                                  onClick={() => addComponent(item.type)}
                                  disabled={readonly}
                                  draggable={!readonly}
                                  onDragStart={(e) => handleDragStart(e, item.type)}
                                  style={{ cursor: readonly ? 'default' : 'grab' }}
                                  title={item.label}
                                >
                                  <i className={`bi ${item.icon} me-2`}></i>
                                  <small className="text-truncate">{item.label}</small>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Form Canvas */}
        <div className="flex-fill overflow-auto">
          <div className="container-fluid p-4">
            <div
              className={`bg-white p-4 rounded shadow-sm border ${isDragOver ? 'border-primary border-2 bg-light' : ''}`}
              style={{ minHeight: '500px' }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-0">{formTitle}</h4>
                  {currentStep && (
                    <div className="mt-2">
                      <span className="badge bg-primary me-2">
                        Step {currentStepIndex + 1}: {currentStep.title}
                      </span>
                      <small className="text-muted">
                        {isDragOver ? 'Drop component here' : 'Add components to this step using the left panel'}
                      </small>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <small className="text-muted align-self-center">
                    <i className="bi bi-info-circle me-1"></i>
                    Auto-save enabled
                  </small>
                </div>
              </div>

              <div className="form-canvas">
                {isDragOver && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ zIndex: 10 }}>
                    <div className="bg-primary text-white p-3 rounded">
                      <i className="bi bi-plus-circle fs-1"></i>
                      <h5 className="mt-2">Drop to Add Component</h5>
                    </div>
                  </div>
                )}

                {currentStep && currentStep.components.length > 0 ? (
                  <div style={{ opacity: isDragOver ? 0.3 : 1 }}>
                    {currentStep.components.map(component => renderComponent(component))}
                  </div>
                ) : currentStep ? (
                  <div className={`text-center text-muted py-5 ${isDragOver ? 'opacity-25' : ''}`}>
                    <i className="bi bi-plus-circle-dotted display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">
                      {isDragOver ? 'Drop Component Here' : 'Add Components'}
                    </h5>
                    <p className="text-muted">
                      {isDragOver ? 'Release to add the component' : 'Drag components from the left panel or click to add'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-plus-circle-dotted display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">Create Your First Step</h5>
                    <p className="text-muted">Add a form step to start building your wizard</p>
                    <button className="btn btn-primary" onClick={addStep}>
                      <i className="bi bi-plus me-2"></i>Add Form Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {showPropertiesPanel && selectedComponent && (
          <div className="bg-light border-start" style={{ width: '380px' }}>
            <div className="p-3 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-gear me-2"></i>Properties
                </h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowPropertiesPanel(false)}
                  title="Hide Properties Panel"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>

              {/* Property Tabs */}
              <ul className="nav nav-tabs nav-fill mb-3" style={{ fontSize: '0.8rem' }}>
                {propertyTabs.map(tab => (
                  <li key={tab.id} className="nav-item">
                    <button
                      className={`nav-link ${propertiesTab === tab.id ? 'active' : ''}`}
                      onClick={() => setPropertiesTab(tab.id)}
                      style={{ padding: '0.5rem 0.25rem' }}
                    >
                      <i className={`bi ${tab.icon} d-block mb-1`} style={{ fontSize: '0.9rem' }}></i>
                      <small>{tab.label}</small>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="bg-white p-3 rounded border flex-fill overflow-auto">
                <h6 className="border-bottom pb-2 mb-3 text-truncate" title={selectedComponent.label}>
                  {selectedComponent.label} ({selectedComponent.type})
                </h6>

                {/* Display Tab */}
                {propertiesTab === 'display' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Label</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={selectedComponent.label}
                      onChange={(e) => updateComponent(selectedComponent.id, { label: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Field Key</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={selectedComponent.key}
                      onChange={(e) => updateComponent(selectedComponent.id, { key: e.target.value })}
                    />
                  </div>

                  {selectedComponent.type !== 'button' && (
                    <div className="mb-3">
                      <label className="form-label">Placeholder</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedComponent.placeholder || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { placeholder: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedComponent.required}
                        onChange={(e) => updateComponent(selectedComponent.id, { required: e.target.checked })}
                      />
                      <label className="form-check-label">Required</label>
                    </div>
                  </div>

                  {['select', 'radio', 'checkboxes'].includes(selectedComponent.type) && (
                    <div className="mb-3">
                      <label className="form-label">Options</label>
                      {(selectedComponent.options || []).map((option, index) => (
                        <div key={index} className="input-group input-group-sm mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(selectedComponent.options || [])];
                              newOptions[index] = e.target.value;
                              updateComponent(selectedComponent.id, { options: newOptions });
                            }}
                          />
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              const newOptions = (selectedComponent.options || []).filter((_, i) => i !== index);
                              updateComponent(selectedComponent.id, { options: newOptions });
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          const newOptions = [...(selectedComponent.options || []), 'New Option'];
                          updateComponent(selectedComponent.id, { options: newOptions });
                        }}
                      >
                        <i className="bi bi-plus"></i> Add Option
                      </button>
                    </div>
                  )}

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={selectedComponent.description || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { description: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedComponent.hidden || false}
                          onChange={(e) => updateComponent(selectedComponent.id, { hidden: e.target.checked })}
                        />
                        <label className="form-check-label small">Hidden</label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedComponent.disabled || false}
                          onChange={(e) => updateComponent(selectedComponent.id, { disabled: e.target.checked })}
                        />
                        <label className="form-check-label small">Disabled</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Tab */}
                {propertiesTab === 'validation' && (
                  <div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedComponent.required || false}
                          onChange={(e) => updateComponent(selectedComponent.id, { required: e.target.checked })}
                        />
                        <label className="form-check-label small fw-bold">Required</label>
                      </div>
                      <small className="form-text text-muted">A required field must be filled in before the form can be submitted.</small>
                    </div>

                    {['textfield', 'textarea', 'password'].includes(selectedComponent.type) && (
                      <>
                        <div className="mb-3">
                          <label className="form-label small fw-bold">Minimum Length</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={selectedComponent.minLength || ''}
                            onChange={(e) => updateComponent(selectedComponent.id, { minLength: parseInt(e.target.value) || undefined })}
                            placeholder="Minimum character requirement"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold">Maximum Length</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={selectedComponent.maxLength || ''}
                            onChange={(e) => updateComponent(selectedComponent.id, { maxLength: parseInt(e.target.value) || undefined })}
                            placeholder="Maximum character limit"
                          />
                        </div>
                      </>
                    )}

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Custom Error Message</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        value={selectedComponent.customErrorMessage || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { customErrorMessage: e.target.value })}
                        placeholder="Custom validation error message"
                      />
                    </div>
                  </div>
                )}

                {/* API Tab */}
                {propertiesTab === 'api' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Property Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedComponent.key}
                        onChange={(e) => updateComponent(selectedComponent.id, { key: e.target.value })}
                      />
                      <small className="form-text text-muted">The name of this field in the API endpoint.</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Custom CSS Class</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedComponent.customClass || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { customClass: e.target.value })}
                        placeholder="custom-class-name"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Tab */}
                {propertiesTab === 'conditional' && (
                  <div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={!!selectedComponent.conditional?.show}
                          onChange={(e) => updateComponent(selectedComponent.id, {
                            conditional: e.target.checked ? { show: true, when: '', eq: '' } : undefined
                          })}
                        />
                        <label className="form-check-label small fw-bold">Conditional Logic</label>
                      </div>
                      <small className="form-text text-muted">Show this component based on other field values</small>
                    </div>

                    {selectedComponent.conditional?.show && (
                      <>
                        <div className="mb-3">
                          <label className="form-label small fw-bold">When Field</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={selectedComponent.conditional.when || ''}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              conditional: { ...selectedComponent.conditional, when: e.target.value }
                            })}
                            placeholder="field_key"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold">Equals Value</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={selectedComponent.conditional.eq || ''}
                            onChange={(e) => updateComponent(selectedComponent.id, {
                              conditional: { ...selectedComponent.conditional, eq: e.target.value }
                            })}
                            placeholder="expected_value"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Logic Tab */}
                {propertiesTab === 'logic' && (
                  <div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Prefix</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedComponent.prefix || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { prefix: e.target.value })}
                        placeholder="$"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Suffix</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={selectedComponent.suffix || ''}
                        onChange={(e) => updateComponent(selectedComponent.id, { suffix: e.target.value })}
                        placeholder=".00"
                      />
                    </div>

                    {selectedComponent.type === 'textfield' && (
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Text Case</label>
                        <select
                          className="form-select form-select-sm"
                          value={selectedComponent.textCase || 'mixed'}
                          onChange={(e) => updateComponent(selectedComponent.id, { textCase: e.target.value as any })}
                        >
                          <option value="mixed">Mixed Case</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="lowercase">lowercase</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;