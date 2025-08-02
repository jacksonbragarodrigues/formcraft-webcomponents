# formcraft - FormCraft Web Component

A React-based web component library that can be used in any web application, including Angular, Vue, vanilla JavaScript, and more.

## Installation

```bash
npm install @formcraft/formcraft-webcomponent
```

## Usage in Angular

```typescript
// main.ts
import '@formcraft/formcraft-webcomponent';

// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  // ... other config
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

// component.html
<formcraft-component 
  mode="renderer"
  [attr.data]="formData"
  (submit)="onFormSubmit($event)"
  (datachange)="onFormDataChange($event)">
</formcraft-component>
```

## Events

- `submit`: Fired when form is submitted
- `datachange`: Fired when form data changes

## License

MIT