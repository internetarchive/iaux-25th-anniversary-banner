import { html, css, LitElement, property, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import CloseCircleIcon from '@internetarchive/icon-close-circle';

import wayforwardSvg from './images/way-forward-svg';
// import {set as setCookie} from 'es-cookie';
// import * as Cookies from 'es-cookie';

@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: String }) baseHost = 'https://archive.org';

  @property({ type: String }) centerImageUrl = '';

  @property({ type: String }) centerImageHoverUrl = '';

  @property({ type: String }) viewMode = 'open'; // open | closed

  @property({ type: String }) text = '';

  @property({ type: String }) centerImgAlt = '';

  @property({ type: Number }) hideBannerDays = 7;

  private closeBanner() {
    this.viewMode = 'closed';
    // fire analytic?

    if (this.hideBannerDays > 0) {
      (window as any)?.Cookies.set('anniv-banner', 'x', {
        path: '/',
        expires: this.hideBannerDays,
        domain: '.archive.org',
      });
    }
  }

  get closeButton() {
    return html`<button
      class="close-banner"
      title="close banner for the day"
      @click=${() => this.closeBanner()}
    >
      ${CloseCircleIcon}
    </button>`;
  }

  render() {
    if (this.viewMode === 'closed') {
      return nothing;
    }

    /*
            <bar-background>
        <left-button>
        <middle-image>
        <text-area>
        <right-button>
        foo

                  <span class="img-links">
            <img alt=${this.centerImgAlt} src=${this.centerImageUrl}>
          </span>
          <span class="text-value">${this.text}</span>

    */
    return html`
      <section class=${this.viewMode}>
        <a class="left-anchor" href=${`${this.baseHost}/25thanniversary`} target="_blank" title="Visit out 25th Anniversary page">
          ${wayforwardSvg}
          <span class="sr-only">Internet Archive at 25</p>
        </a>
        <div class="dynamic-center center">

        </div>

        <a class="img-links right" href="https://archive.org" target="_blank" title="Visit out Wayforward machine">
          Visit our Way forward machine.
        </a>
        ${this.closeButton}
      </section>

    `;
  }

  static styles = css`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }
    section {
      display: flex;
      align-items: center;
      padding: 25px;
      color: var(--anniv-banner-text-color, #fff);
      background-color: var(--anniv-banner-bg-color, blue);
      padding: 0;
      height: 0;
    }

    section.open {
      height: 60px;
    }

    section > * {
      display: inline-block;
      border: 1px solid red;
    }

    img {
      height: 60px;
    }

    .left-anchor {
      max-width: 157px; // width of svg
      border-right: 1px solid #fff;
    }

    .text-value {
      font-size: 24px;
    }

    .close-banner {
      position: absolute;
      right: 0;
      top: 0;
      background-color: transparent;
      background-repeat: no-repeat;
      border: none;
      cursor: pointer;
      overflow: hidden;
      outline: none;
      box-sizing: border-box;
      width: 30px;
      height: 30px;
    }
    .close-banner .fill-color {
      fill: #fff;
    }

    @media only screen and (max-width: 700px) {
      .text-value {
        display: none;
      }
    }
  `;
}

/**

    .left, right {
      width: 15%;
    }

    .center {
      width: 45%;
    }

    .img-links {
      height: inherit;
      position: relative;
      display: inline-block;
    }
    .img-links > * {
      width: 100%;
    }

 */
