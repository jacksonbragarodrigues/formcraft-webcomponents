import { Component } from '@angular/core';

@Component({
  selector: 'app-formcraft-example',
  template: `
    <formcraft-component 
      mode="renderer"
      [attr.data]="formData"
      (submit)="onFormSubmit($event)"
      (datachange)="onFormDataChange($event)">
    </formcraft-component>
  `
})
export class FormcraftExampleComponent {
  formData = JSON.stringify({
    wizardSteps: [],
    formValues: {},
    currentStepIndex: 0
  });

  onFormSubmit(event: any) {
    console.log('Form submitted:', event.detail.formData);
  }

  onFormDataChange(event: any) {
    this.formData = event.detail.data;
  }
}