import { html, css, LitElement, customElement } from 'lit-element';
import '../src/ia-anniversary-banner-dissolve';
import './dev-tray';

@customElement('app-root')
export class AppRoot extends LitElement {
  render() {
    return html` <ia-anniversary-banner></ia-anniversary-banner> `;
  }

  static get styles() {
    const main = css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: auto;
      }
    `;
    return [main];
  }
}
