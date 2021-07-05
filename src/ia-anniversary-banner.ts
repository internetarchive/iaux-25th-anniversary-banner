import { html, css, LitElement, property, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import CloseCircleIcon from '@internetarchive/icon-close-circle';

import { IAFile, IAMD, TimelineMoment } from './interfaces';

import { shuffle, formatMoments } from './utils';
import wayforwardSvg from './images/way-forward-svg';
import wayforwardSvgMin from './images/way-forward-min-svg';

import './marquee';

@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Object }) iaFiles: IAFile[] = [];

  @property({ type: Object }) iaMD: IAMD = { directory: '', separator_dir: '' };

  @property({ type: Object }) moments: { [key: string]: TimelineMoment } = {};

  @property({ type: Array }) shuffledMoments: TimelineMoment[] = [];

  @property({ type: String }) landingURL = 'https://archive.org';

  @property({ type: String }) viewMode = 'open'; // open | closed

  @property({ type: Number }) hideBannerDays = 7;

  updated(changed: any) {
    if (changed.has('iaFiles') || changed.has('iaMD')) {
      this.shuffleMoments();
    }
  }

  shuffleMoments() {
    const foundMoments = formatMoments(
      this.iaFiles,
      this.iaMD,
      this.landingURL
    );

    const shuffledMoments = shuffle(foundMoments);
    this.shuffledMoments = [...shuffledMoments];

    this.dispatchEvent(
      new CustomEvent('momentsShuffled', {
        detail: { moments: this.shuffledMoments },
      })
    );
  }

  private closeBanner() {
    this.viewMode = 'closed';

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

    return html`
      <section class=${this.viewMode}>
        <a
          class="left-anchor"
          href=${this.landingURL}
          target="_blank"
          title="Celebrate Internet Archive's 25th Anniversary"
          rel="nofollow"
        >
          ${wayforwardSvgMin} ${wayforwardSvg}
        </a>
        <mar-quee .list=${this.shuffledMoments}></mar-quee>
        ${this.closeButton}
      </section>
    `;
  }

  static get styles() {
    const bannerHeight = css`var(--bannerHeight, 50px)`;
    const marqueeWidth = css`var(--marquee-width, 150%)`;
    const marqueeAnimation = css`var(--marquee-animation-s, 50s)`;

    return css`
      :host {
        --bannerHeight: ${bannerHeight};
        --marquee-height: ${bannerHeight};
        --marquee-width: ${marqueeWidth};
        --marquee-animation-s: ${marqueeAnimation};
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
        height: ${bannerHeight};
      }

      section > * {
        display: inline-block;
        height: inherit;
      }

      .left-anchor {
        max-width: 157px; /* width of button svg */
        display: flex;
        align-items: center;
        padding: 0 10px;
      }

      mar-quee {
        width: calc(100% - 187px);
      }

      .text-value {
        font-size: 24px;
      }

      .close-banner {
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        outline: none;
        width: 30px;
        box-sizing: border-box;
      }
      .close-banner .fill-color {
        fill: #fff;
      }

      .wayforward-logo {
        width: 157px;
        height: 35px;
      }

      .wayforward-logo-min {
        height: 32px;
        width: 32px;
        display: none;
      }

      @media only screen and (max-width: 700px) {
        mar-quee {
          width: calc(100% - 82px);
        }

        .wayforward-logo-min {
          display: block;
        }

        .wayforward-logo,
        .svg-words,
        .text-value {
          display: none;
        }
      }
    `;
  }
}
