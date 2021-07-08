import { html, css, LitElement, customElement, property } from 'lit-element';
import { nothing } from 'lit-html';
import { IAMD, TimelineMoment } from '../src/interfaces';
import '../src/ia-anniversary-banner';
import './dev-tray';

@customElement('app-root')
export class AppRoot extends LitElement {
  @property({ type: Object }) itemMD: IAMD = {
    directory: '',
    separator_dir: '',
  };

  @property({ type: Array }) itemFiles: any[] = [];

  @property({ type: String }) directory = '';

  @property({ type: String }) bannerHeight = '';

  @property({ type: String }) bannerTiming = '';

  @property({ type: String }) bannerColor = '';

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
  }

  directoryChange(e: CustomEvent) {
    const { detail } = e;
    if (!detail.directory) {
      return;
    }
    this.itemMD = { ...this.itemMD, directory: detail.directory };
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

  bannerColorChange(e: CustomEvent) {
    const { detail } = e;
    if (detail.bannerColor) {
      this.bannerColor = detail.bannerColor;
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
    const bannerColor = this.bannerColor
      ? `--anniv-banner-bg-color: #${this.bannerColor}`
      : null;

    const allStyles = [bannerHeight, bannerTiming, bannerColor].filter(
      x => !!x
    );
    return allStyles;
  }

  get devTrayView() {
    return html`
      <dev-tray
        @directoryChange=${this.directoryChange}
        @bannerHeightChange=${this.bannerHeightChange}
        @bannerTimingChange=${this.bannerTimingChange}
        @bannerColorChange=${this.bannerColorChange}
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
      }
    `;
    return [main];
  }
}
