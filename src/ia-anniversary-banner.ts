import { LitElement, customElement, html, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import CloseCircleIcon from '@internetarchive/icon-close-circle';

enum BannerViewMode {
  Open = 'open',
  Closed = 'closed',
}

@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Number }) hideBannerDays = 3;

  @property({ type: String }) viewMode: BannerViewMode = BannerViewMode.Open;

  bannerClick() {
    this.dispatchEvent(new Event('bannerClick'));
  }

  render() {
    if (this.viewMode === BannerViewMode.Closed) {
      return nothing;
    }

    const link = 'https://wayforward.archive.org';
    const linkAltText =
      'Travel with us to 2046 and imagine the future of the internet.';

    return html`
      <section clas="wayforward">
        <a href=${link} title=${linkAltText} @click=${this.bannerClick}>
          <picture class="wayforward banner">
            <source
              srcset="
                https://archive.org/download/ia-25-wf/wf-banner-mobile-tiny.png
              "
              media="(max-width: 1000px)"
            />
            <img
              class="banner-img mobile"
              alt="the wayforward machine"
              src="https://archive.org/download/ia-25-wf/wf-banner-desktop-tiny.png"
            />
          </picture>
        </a>
        <button
          class="close-banner"
          title=${`Close wayforward banner for ${this.hideBannerDays} days.`}
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
  }

  static get styles() {
    const mobileHeight = css`var(--annivBannerMobileHeight, 60px)`;
    const wideHeight = css`var(--annivBannerWideHeight, 90px)`;

    const height = css`var(--annivBannerHeight, 90px)`;
    const closeButtonFill = css`var(--annivBannerCloseButtonFill, #fff)`;
    return css`
      section {
        position: relative;
        height: ${height};
        overflow: hidden;
      }

      a {
        display: block;
        overflow: hidden;
        height: inherit;
      }

      img.banner-img {
        max-height: 100%;
        display: block;
        margin: auto;
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

      .banner {
        margin: 0;
        background-image: url('https://archive.org/download/ia-25-wf/wf-banner-desktop-tiny.png');
        height: ${height};
        background-size: cover;
        background-repeat: round;
        background-position: unset;
        display: block;
      }

      figcaption {
        height: 1px;
        overflow: hidden;
        width: 1px;
        position: relative;
      }

      @media screen and (max-width: 550px) {
        :host {
          --annivBannerHeight: ${mobileHeight};
        }
      }

      @media screen and (min-width: 1300px) {
        :host {
          --annivBannerHeight: ${wideHeight};
        }
      }
    `;
  }
}
