import { html, css, LitElement, customElement } from 'lit-element';
import '../src/ia-anniversary-banner';

@customElement('app-root')
export class AppRoot extends LitElement {
  render() {
    return html`
      <ia-anniversary-banner
        text="The Internet Archive launches the Wayback machine"
        centerImgAlt="Oct 24, 2001"
        centerImageUrl="https://archive.org/download/isa-9001599455299596/center-img-wayback.png"
      >
      </ia-anniversary-banner>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}
