import { html, css, LitElement, customElement, property } from 'lit-element';
import { nothing } from 'lit-html';
import { IAMD, TimelineMoment } from '../src/interfaces';
import '../src/ia-anniversary-banner';
import './dev-tray';

@customElement('app-root')
export class AppRoot extends LitElement {
  @property({ type: Object }) itemMD: IAMD | null = null;

  @property({ type: Array }) itemFiles: any[] = [];

  @property({ type: String }) directory = '';

  @property({ type: String }) bannerHeight = '';

  @property({ type: String }) bannerTiming = '';

  @property({ type: Array }) displayedMoments: TimelineMoment[] = [];

  @property({ type: String }) devTray: 'enabled' | '' = 'enabled';

  firstUpdated() {
    this.getItem();
  }

  async getItem() {
    const itemMD = await fetch(
      'https://archive.org/metadata/isa-9001599455299596/metadata'
    ).then(response => response.json());
    const itemFiles = await fetch(
      'https://archive.org/metadata/isa-9001599455299596/files'
    ).then(response => response.json());

    this.itemMD = itemMD.result;
    this.itemFiles = itemFiles.result;
    this.directory = this.itemMD?.directory || '';
  }

  directoryChange(e: CustomEvent) {
    const { detail } = e;
    if (!detail.directory) {
      return;
    }

    const md = { ...this.itemMD, directory: detail.directory };
    this.itemMD = md;
  }

  bannerHeightChange(e: CustomEvent) {
    const { detail } = e;
    if (detail.bannerHeight) {
      this.bannerHeight = detail.bannerHeight;
    }
  }

  bannerTimingChange(e: CustomEvent) {
    const { detail } = e;
    if (detail.bannerTiming) {
      this.bannerTiming = detail.bannerTiming;
    }
  }

  momentListUpdated(e: CustomEvent) {
    const { detail } = e;
    if (detail.moments) {
      this.displayedMoments = detail.moments;
    }
  }

  get bannerStyle() {
    const bannerHeight = this.bannerHeight
      ? `--bannerHeight: ${this.bannerHeight}px`
      : null;
    const bannerTiming = this.bannerTiming
      ? `--marquee-animation-s: ${this.bannerTiming}s`
      : null;

    const allStyles = [bannerHeight, bannerTiming].filter(x => !!x);
    return allStyles;
  }

  get devTrayView() {
    return html`
      <dev-tray
        @directoryChange=${this.directoryChange}
        @bannerHeightChange=${this.bannerHeightChange}
        @bannerTimingChange=${this.bannerTimingChange}
        .momentsDisplayed=${this.displayedMoments}
      ></dev-tray>
    `;
  }

  render() {
    return html`
      <ia-anniversary-banner
        .iaFiles=${this.itemFiles}
        .iaMD=${this.itemMD}
        style=${this.bannerStyle}
        @momentsShuffled=${this.momentListUpdated}
        landingURL="https://www-isa3.archive.org/anniversary"
      >
      </ia-anniversary-banner>
      ${this.devTray === 'enabled' ? this.devTrayView : nothing}
    `;
  }

  static get styles() {
    const main = css`
      :host {
        display: block;
        --marquee-animation-s: var(--marquee-animation-s, 50s);
        --marquee-width: var(--marquee-width, 150%);
      }
    `;
    return [main];
  }
}
