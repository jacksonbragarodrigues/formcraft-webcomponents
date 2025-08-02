import React from 'react';
import { createRoot } from 'react-dom/client';
import FormCraftWebComponent from '../src/FormCraftWebComponent';

const App: React.FC = () => {
  const [mode, setMode] = React.useState<'builder' | 'renderer' | 'preview'>('renderer');
  const [data] = React.useState(JSON.stringify({
    wizardSteps: [
    {
        "id": "step_1754156122258",
        "type": "step",
        "title": "Step 1",
        "description": "",
        "components": []
    }
],
    formValues: {},
    currentStepIndex: 0
  }));

  return (
    <div className="container py-4">
      <h1>FormCraft Web Component Development</h1>
      
      <div className="btn-group mb-4">
        <button
          className={`btn ${mode === 'renderer' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setMode('renderer')}
        >
          Renderer
        </button>
        <button
          className={`btn ${mode === 'builder' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setMode('builder')}
        >
          Builder
        </button>
      </div>
      
      <FormCraftWebComponent
        mode={mode}
        data={data}
        onSubmit={(formData) => console.log('Form submitted:', formData)}
        onDataChange={(data) => console.log('Data changed:', data)}
      />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}