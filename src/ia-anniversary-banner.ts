import { html, css, LitElement, property, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import CloseCircleIcon from '@internetarchive/icon-close-circle';

import { IAFile, IAMD, TimelineMoment } from './interfaces';

import { formatMoments } from './utils';
import wayforwardSvg from './images/way-forward-svg';
import wayforwardSvgMin from './images/way-forward-min-svg';

import './marquee';

enum BannerViewMode {
  Open = 'open',
  Closed = 'closed',
}

@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Array }) iaFiles: IAFile[] = [];

  @property({ type: Object }) iaMD: IAMD = { directory: '', separator_dir: '' };

  @property({ type: Object }) moments: Record<string, TimelineMoment> = {};

  @property({ type: Array }) shuffledMoments: TimelineMoment[] = [];

  @property({ type: String }) landingURL = 'https://archive.org';

  @property({ type: String }) viewMode: BannerViewMode = BannerViewMode.Open;

  @property({ type: Number }) hideBannerDays = 7;

  @property({ type: String }) directory = '';

  updated(changed: any) {
    if (changed.has('iaFiles') || changed.has('iaMD')) {
      this.shuffledMoments = [];
      const { directory } = this.iaMD;
      this.directory = directory;
    }
    if (changed.has('directory')) {
      this.shuffleMoments(this.directory);
    }
  }

  shuffleMoments(directory: string) {
    const moments: TimelineMoment[] = formatMoments(
      this.iaFiles,
      this.iaMD,
      this.landingURL,
      directory
    );

    const newMoments = [...moments];
    this.shuffledMoments = newMoments;

    this.dispatchEvent(
      new CustomEvent('momentsShuffled', {
        detail: { moments: this.shuffledMoments },
      })
    );
  }

  private closeBanner() {
    this.viewMode = BannerViewMode.Closed;
    this.dispatchEvent(new Event('bannerClosed'));
  }

  get closeButton() {
    return html`<button
      class="close-banner"
      title=${`Close anniversary banner for ${this.hideBannerDays} days.`}
      @click=${this.closeBanner}
    >
      ${CloseCircleIcon}
    </button>`;
  }

  render() {
    if (this.viewMode === BannerViewMode.Closed) {
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
          data-event-click-tracking="Anniv25Banner|LeftAnchor"
        >
          ${wayforwardSvgMin} ${wayforwardSvg}
        </a>
        <ia-anniversary-marquee
          class="marquee"
          .list=${this.shuffledMoments}
          .defaultLink=${this.landingURL}
        ></ia-anniversary-marquee>
        ${this.closeButton}
      </section>
    `;
  }

  static get styles() {
    const bannerHeight = css`var(--bannerHeight, 50px)`;
    const marqueeAnimation = css`var(--marquee-animation-s, 100s)`;
    const bannerBg = css`var(--anniv-banner-bg-color, #1812d6)`;
    const leftAnchorWidth = css`varea(--anniv-anchor-width, 157px)`; /* width of button svg */
    return css`
      :host {
        --bannerHeight: ${bannerHeight};
        --marquee-height: ${bannerHeight};
        --marquee-animation-s: ${marqueeAnimation};
        --banner-color: ${bannerBg};
      }

      section,
      section * > * {
        display: flex;
        align-items: center;
      }
      section > * {
        height: inherit;
      }
      section {
        padding: 25px;
        color: var(--anniv-banner-text-color, #fff);
        background-color: var(--banner-color);
        padding: 0;
        height: 0;
      }
      section.open {
        height: ${bannerHeight};
      }

      .left-anchor {
        max-width: ${leftAnchorWidth};
        display: flex;
        align-items: center;
        padding: 0 10px;
      }

      .marquee {
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
        box-sizing: border-box;
        padding: 0 8px;
        display: inline-block;
      }
      .close-banner .fill-color {
        fill: #fff;
      }

      .wayforward-logo {
        width: 157px;
        height: 35px;
        padding-top: 2px;
      }
      .wayforward-logo-min {
        height: 32px;
        width: 32px;
        display: none;
      }

      @media only screen and (max-width: 700px) {
        .marquee {
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
