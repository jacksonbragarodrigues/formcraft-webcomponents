export interface FormComponent {
  id: string;
  type: string;
  label: string;
  description?: string;
  tooltip?: string;
  required: boolean;
  key: string;
  position: 'top' | 'left' | 'right' | 'bottom';
  placeholder?: string;
  options?: string[];
  helpText?: string;
  conditional?: {
    show: boolean;
    when: string;
    eq: string;
  };
  children?: FormComponent[];
  customClass?: string;
  defaultValue?: any;
  apiUrl?: string;
  columns?: number;
  rows?: FormComponent[][];
  editorContent?: string;
  datagridColumns?: { title: string; width: number; id: string }[];
  columnSizes?: number[];
  hidden?: boolean;
  hiddenLabel?: boolean;
  disabled?: boolean;
  customErrorMessage?: string;
  horizontalLayout?: boolean;
  minItems?: number;
  maxItems?: number;
  minItemsError?: string;
  maxItemsError?: string;
  multipleValues?: boolean;
  prefix?: string;
  suffix?: string;
  inputType?: 'normal' | 'calendar';
  textCase?: 'mixed' | 'uppercase' | 'lowercase';
  minLength?: number;
  maxLength?: number;
  minWords?: number;
  maxWords?: number;
  collapsible?: boolean;
  startCollapsed?: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  components: FormComponent[];
}

export interface FormCraftData {
  wizardSteps: WizardStep[];
  formValues: { [key: string]: any };
  currentStepIndex: number;
}