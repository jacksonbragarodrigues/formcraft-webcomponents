import './styles/index.css';
import { registerFormCraftWebComponent } from './utils/webComponentWrapper';
import FormCraftWebComponent from './FormCraftWebComponent';

// Auto-register the web component
registerFormCraftWebComponent();

// Export for manual registration or React usage
export { FormCraftWebComponent, registerFormCraftWebComponent };
export * from './types';

// For UMD builds
if (typeof window !== 'undefined') {
  (window as any).FormCraft = {
    FormCraftWebComponent,
    registerFormCraftWebComponent
  };
}