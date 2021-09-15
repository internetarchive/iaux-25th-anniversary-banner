import { LitElement, customElement, html, css, property } from 'lit-element';
import { nothing } from 'lit-html';
import baseLayer from './svgs/base-layer';
import text1 from './svgs/text-1';
import text2 from './svgs/text-2';

enum TextDisplay {
  main = 'main',
  cta = 'cta',
}
@customElement('ia-anniversary-banner')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Number }) animationTimingSeconds: number = 5;

  @property({ type: String }) textShown: 'main' | 'cta' = 'main';

  @property({ attribute: false }) interval: ReturnType<
    typeof setTimeout
  > | null = null;

  @property({ type: Boolean }) intervalStarted: boolean = false;

  @property({ type: String }) toggleState: 'toggling' | 'stop' = 'stop';

  updated(changed: { has: (arg0: string) => any }) {
    if (changed.has('animationTimingSeconds') || changed.has('textShown')) {
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
      this.animationTimingSeconds * 1000
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

  render() {
    const link = 'https://anniversary.archive.org';
    return html`
      <section>
        <a
          href=${link}
          alt="Come celebrate 25 years with us."
          data-event-click-tracking="Anniv25Banner|Homepage"
        >
          <div>
            <figure>
              ${baseLayer}
              <div class="text main ${this.showMainCss}">${text1}</div>
              ${this.intervalStarted
                ? html`<div class="text cta ${this.showCtaCss}">${text2}</div>`
                : nothing}
              <figcaption>
                Homepage banner celebrating 25 years of the Internet Archive.
              </figcaption>
            </figure>
          </div>
        </a>
      </section>
    `;
  }

  static get styles() {
    const mobileHeight = css`var(--annivBannerMobileHeight, 80px)`;
    const tabletHeight = css`var(--annivBannerTabletHeight, 100px)`;
    const desktopHeight = css`var(--annivBannerDesktopHeight, 130px)`;
    const ultraWideHeight = css`var(--annivBannerUltraWideHeight, 180px)`;

    const height = css`var(--annivBannerHeight, ${ultraWideHeight})`;
    return css`
      section,
      section > * {
        display: block;
        position: relative;
        width: 100%;
        height: ${height};
      }

      section .text {
        transition: opacity var(--annivBannerTxSeconds, 3s);
      }

      section .text.hide {
        opacity: 0;
      }

      section .text.show {
        opacity: 1;
      }

      a {
        background-image: url('https://archive.org/download/ia-25-home-square-optimized/ia-25-banner-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      figcaption {
        height: 1px;
        overflow: hidden;
        width: 1px;
        position: relative;
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

      svg {
        width: 100%;
        height: 100%;
      }

      @media only screen and (max-width: 760px) {
        :host {
          --annivBannerHeight: ${mobileHeight};
        }
      }

      @media only screen and (min-width: 761px) and (max-width: 1000px) {
        :host {
          --annivBannerHeight: ${tabletHeight};
        }
      }

      @media only screen and (min-width: 1001px) and (max-width: 1439px) {
        :host {
          --annivBannerHeight: ${desktopHeight};
        }
      }

      @media only screen and (min-width: 1440px) {
        :host {
          --annivBannerHeight: ${ultraWideHeight};
        }
      }
    `;
  }
}
