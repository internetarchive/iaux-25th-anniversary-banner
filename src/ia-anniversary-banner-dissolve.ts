import { LitElement, customElement, html, css } from 'lit-element';
import baseLayer from './svgs/base-layer';
import text1 from './svgs/text-1';
import text2 from './svgs/text-2';

@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  render() {
    // const link = 'https://anniversary.archive.org';
    const link = '#';
    const showText1 = 'show';
    const showText2 = '';
    return html`
      <section>
        <a href=${link} alt="Come celebrate 25 years with us.">
          <div class="content">
            <figure class="pin">
              ${baseLayer}
              <div class="text1 ${showText1}">${text1}</div>
              <div class="text2 ${showText2}">${text2}</div>
            </figure>
          </div>
        </a>
      </section>
    `;
  }

  static get styles() {
    const height = css`var(--bannerHeight, 180px)`;
    return css`
      section,
      section > * {
        display: block;
        position: relative;
        width: 100%;
        height: ${height};
      }
      a {
        background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-25-banner-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      figure,
      svg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
      }
      figure {
        border: 1px solid orange;
      }

      svg {
        width: 100%;
        height: 100%;
      }

      @media only screen and (max-width: 760px) {
        :host {
          --bannerHeight: 80px;
        }
      }

      @media only screen and (min-width: 761px) and (max-width: 1000px) {
        :host {
          --bannerHeight: 100px;
        }
      }

      @media only screen and (min-width: 1001px) and (max-width: 1439px) {
        :host {
          --bannerHeight: 130px;
        }
      }

      @media only screen and (min-width: 1440px) {
        :host {
          --bannerHeight: 180px;
        }
      }
    `;
  }
}
