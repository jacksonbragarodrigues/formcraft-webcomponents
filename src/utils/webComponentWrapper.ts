import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import FormCraftWebComponent, { FormCraftWebComponentProps } from '../FormCraftWebComponent';

class FormCraftCustomElement extends HTMLElement {
  private root: Root | null = null;

  static get observedAttributes() {
    return ['mode', 'data', 'readonly', 'theme'];
  }

  connectedCallback() {
    this.mount();
  }

  disconnectedCallback() {
    this.unmount();
  }

  attributeChangedCallback() {
    this.updateProps();
  }

  private mount() {
    if (!this.root) {
      this.root = createRoot(this);
      this.updateProps();
    }
  }

  private unmount() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private updateProps() {
    if (!this.root) return;

    const props: FormCraftWebComponentProps = {
      mode: (this.getAttribute('mode') as any) || 'renderer',
      data: this.getAttribute('data') || undefined,
      readonly: this.hasAttribute('readonly'),
      theme: (this.getAttribute('theme') as any) || 'light',
      onDataChange: (data: string) => {
        this.dispatchEvent(new CustomEvent('datachange', {
          detail: { data },
          bubbles: true
        }));
      },
      onSubmit: (formData: { [key: string]: any }) => {
        this.dispatchEvent(new CustomEvent('submit', {
          detail: { formData },
          bubbles: true
        }));
      }
    };

    this.root.render(React.createElement(FormCraftWebComponent, props));
  }

  setData(data: string) {
    this.setAttribute('data', data);
  }

  getData(): string | null {
    return this.getAttribute('data');
  }

  setMode(mode: 'builder' | 'renderer' | 'preview') {
    this.setAttribute('mode', mode);
  }

  getMode(): string {
    return this.getAttribute('mode') || 'renderer';
  }
}

export function registerFormCraftWebComponent(tagName = 'formcraft-component') {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, FormCraftCustomElement);
  }
}

export { FormCraftCustomElement };