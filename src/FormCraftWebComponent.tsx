import React, { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder';
import FormRenderer from './components/FormRenderer';
import { FormComponent, WizardStep } from './types';

export interface FormCraftWebComponentProps {
  mode?: 'builder' | 'renderer' | 'preview';
  data?: string; // JSON string of form data
  onDataChange?: (data: string) => void;
  onSubmit?: (formData: { [key: string]: any }) => void;
  readonly?: boolean;
  theme?: 'light' | 'dark';
}

const FormCraftWebComponent: React.FC<FormCraftWebComponentProps> = ({
  mode = 'renderer',
  data,
  onDataChange,
  onSubmit,
  readonly = false,
  theme = 'light'
}) => {
  const [wizardSteps, setWizardSteps] = useState<WizardStep[]>([
  {
    "id": "step_1754162098311",
    "type": "step",
    "title": "Step 1",
    "description": "",
    "components": []
  }
]);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Parse data prop when it changes
  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.wizardSteps) {
          setWizardSteps(parsedData.wizardSteps);
        }
        if (parsedData.formValues) {
          setFormValues(parsedData.formValues);
        }
        if (parsedData.currentStepIndex !== undefined) {
          setCurrentStepIndex(parsedData.currentStepIndex);
        }
      } catch (e) {
        console.error('Failed to parse FormCraft data:', e);
      }
    }
  }, [data]);

  // Notify parent of data changes
  const handleDataChange = (newWizardSteps: WizardStep[], newFormValues: { [key: string]: any }) => {
    setWizardSteps(newWizardSteps);
    setFormValues(newFormValues);
    
    if (onDataChange) {
      const dataToSend = JSON.stringify({
        wizardSteps: newWizardSteps,
        formValues: newFormValues,
        currentStepIndex
      });
      onDataChange(dataToSend);
    }
  };

  const handleFormSubmit = (submittedData: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(submittedData);
    }
  };

  return (
    <div className={`formcraft-webcomponent theme-${theme}`} data-mode={mode}>
      {mode === 'builder' ? (
        <FormBuilder
          wizardSteps={wizardSteps}
          formValues={formValues}
          onDataChange={handleDataChange}
          readonly={readonly}
        />
      ) : (
        <FormRenderer
          wizardSteps={wizardSteps}
          formValues={formValues}
          currentStepIndex={currentStepIndex}
          onStepChange={setCurrentStepIndex}
          onFormSubmit={handleFormSubmit}
          onValueChange={(key, value) => {
            const newValues = { ...formValues, [key]: value };
            setFormValues(newValues);
            handleDataChange(wizardSteps, newValues);
          }}
          readonly={readonly}
          preview={mode === 'preview'}
        />
      )}
    </div>
  );
};

export default FormCraftWebComponent;