import { LitElement, customElement, html, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import CloseCircleIcon from '@internetarchive/icon-close-circle';
import baseLayer from './svgs/base-layer';
import text1 from './svgs/text-1';
import text2 from './svgs/text-2';

import mobileBaseLayer from './svgs/mobile/base-layer';
import mobileText1 from './svgs/mobile/text-1';
import mobileText2 from './svgs/mobile/text-2';

enum TextDisplay {
  main = 'main',
  cta = 'cta',
}

enum BannerViewMode {
  Open = 'open',
  Closed = 'closed',
}

enum BannerTypes {
  Anniversary = 'anniversary',
  Wayforward = 'wayforward',
}

enum BannerAltText {
  Anniversary = 'Come celebrate 25 years with us.',
  Wayforward = 'Travel with us to 2046 and imagine the future of the internet.',
}

enum BannerLinks {
  Anniversary = 'https://anniversary.archive.org',
  Wayforward = 'https://wayforward.archive.org',
}
@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Number }) toggleTextSeconds: number = 3;

  @property({ type: Boolean }) intervalStarted: boolean = false;

  @property({ type: String }) textShown: 'main' | 'cta' = 'main';

  @property({ attribute: false }) interval: ReturnType<
    typeof setTimeout
  > | null = null;

  @property({ type: Number }) hideBannerDays = 3;

  @property({ type: String }) viewMode: BannerViewMode = BannerViewMode.Open;

  @property({ type: String }) bannerType: BannerTypes = BannerTypes.Anniversary;

  disconnectedCallback() {
    this.clearInterval();
  }

  updated(changed: { has: (arg0: string) => any }) {
    if (changed.has('toggleTextSeconds') || changed.has('textShown')) {
      this.startTextSwap();
    }
  }

  clearInterval() {
    const { interval } = this;
    clearInterval(interval as ReturnType<typeof setTimeout>);
    this.intervalStarted = false;
    this.interval = null;
  }

  startTextSwap() {
    if (this.interval) {
      return;
    }

    this.intervalStarted = !this.intervalStarted;
    this.interval = setInterval(
      () => this.toggleText(),
      this.toggleTextSeconds * 1000
    );
  }

  get ctaTextLayer() {
    return this.shadowRoot?.querySelector(`.${TextDisplay.cta}`);
  }

  get mainTextLayer() {
    return this.shadowRoot?.querySelector(`.${TextDisplay.main}`);
  }

  async toggleText() {
    this.textShown =
      this.textShown === TextDisplay.main ? TextDisplay.cta : TextDisplay.main;
  }

  get showMainCss(): string {
    if (this.textShown === TextDisplay.main) {
      return 'show';
    }

    return 'hide';
  }

  get showCtaCss() {
    if (this.textShown === TextDisplay.cta) {
      return 'show';
    }

    return 'hide';
  }

  get mobileBanner() {
    return html`
      <div class="mobile-banner">
        <div class="base">${mobileBaseLayer}</div>
        <div class="text main ${this.showMainCss}">${mobileText1}</div>
        ${this.intervalStarted
          ? html`<div class="text cta ${this.showCtaCss}">${mobileText2}</div>`
          : nothing}
      </div>
    `;
  }

  get desktopBanner() {
    return html`
      <div class="desktop-banner">
        <div class="base">${baseLayer}</div>
        <div class="text main ${this.showMainCss}">${text1}</div>
        ${this.intervalStarted
          ? html`<div class="text cta ${this.showCtaCss}">${text2}</div>`
          : nothing}
      </div>
    `;
  }

  bannerClick() {
    this.dispatchEvent(new Event('bannerClick'));
  }

  get annivBanner() {
    return html`
      <div>
        <figure class="anniversary banner">
          ${this.mobileBanner} ${this.desktopBanner}
          <figcaption>
            Homepage banner celebrating 25 years of the Internet Archive.
          </figcaption>
        </figure>
      </div>
    `;
  }

  get wayforwardBanner() {
    return html` <figure class="wayforward banner"></figure> `;
  }

  render() {
    if (this.viewMode === BannerViewMode.Closed) {
      return nothing;
    }

    const link =
      this.bannerType === BannerTypes.Wayforward
        ? BannerLinks.Wayforward
        : BannerLinks.Anniversary;
    const linkAltText =
      this.bannerType === BannerTypes.Wayforward
        ? BannerAltText.Wayforward
        : BannerAltText.Anniversary;
    const bannerToDraw =
      this.bannerType === BannerTypes.Wayforward
        ? this.wayforwardBanner
        : this.annivBanner;

    return html`
      <section class=${this.bannerType}>
        <a href=${link} alt=${linkAltText} @click=${this.bannerClick}>
          ${bannerToDraw}
        </a>
        <button
          class="close-banner"
          title=${`Close anniversary banner for ${this.hideBannerDays} days.`}
          @click=${this.closeBanner}
        >
          ${CloseCircleIcon}
        </button>
      </section>
    `;
  }

  private closeBanner() {
    this.viewMode = BannerViewMode.Closed;
    this.dispatchEvent(new Event('bannerClosed'));
    this.clearInterval();
  }

  static get styles() {
    const mobileHeight = css`var(--annivBannerMobileHeight, 52px)`;
    const height = css`var(--annivBannerHeight, 90px)`;
    const closeButtonFill = css`var(--annivBannerCloseButtonFill, #222)`;
    const wayforwardButtonFill = css`#fff`;
    return css`
      section {
        position: relative;
        height: ${height};
        overflow: hidden;
      }

      section .text {
        transition: opacity var(--annivBannerTxSeconds, 0.25s);
      }

      section .text.hide {
        opacity: 0;
      }

      section .text.show {
        opacity: 1;
      }

      a {
        display: block;
        overflow: hidden;
        height: inherit;
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
        overflow: hidden;
        height: 30px;
        width: 30px;
        position: absolute;
        top: 0;
        right: 0;
      }
      .close-banner svg {
        height: 15px;
        width: 15px;
        display: block;
        margin: auto;
      }
      .close-banner .fill-color {
        fill: ${closeButtonFill};
      }

      .wayforward .close-banner .fill-color {
        fill: ${wayforwardButtonFill};
      }

      .banner {
        margin: 0;
        background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-25-banner-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: ${height};
      }

      .anniversary.banner {
        background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-25-banner-bg.png');
      }

      .wayforward.banner {
        background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-anniv-wayforward-banner-desktop.png');
      }

      figcaption {
        height: 1px;
        overflow: hidden;
        width: 1px;
        position: relative;
      }

      .base,
      .text {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
      }

      .base svg,
      .text svg {
        height: 100%;
        width: 100%;
      }

      .mobile-banner {
        display: none;
      }

      @media screen and (max-width: 767px) {
        :host {
          --annivBannerHeight: ${mobileHeight};
        }

        .mobile-banner {
          display: block;
        }

        .desktop-banner {
          display: none;
        }

        .anniversary.banner {
          background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-anniv-banner-bg-mobile.png');
        }

        .wayback.banner {
          background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-anniv-wayforward-banner-mobile.png');
        }
      }
    `;
  }
}
