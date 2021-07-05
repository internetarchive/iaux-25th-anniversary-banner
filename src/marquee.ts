import {
  customElement,
  LitElement,
  property,
  TemplateResult,
  css,
  html,
} from 'lit-element';
import { TimelineMoment } from './interfaces';

type AnimationState = 'animate' | 'stop';

@customElement('mar-quee')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Array }) list: TimelineMoment[] = [];

  @property({ type: String }) animationState: AnimationState = 'animate';

  /** @inheritdoc */
  firstUpdated() {
    // todo: start prefetching images
  }

  get contentBlocks() {
    const listView = this.list.map((moment: TimelineMoment, index) => {
      const defaultUrl = `https://www-isa3.archive.org/25th-anniversary`;
      const { altText, desktopImg, mobileImg, link = defaultUrl } = moment;
      const content = html`
        <a class="content-block" href=${link}>
          <img class="full" src=${desktopImg} alt=${altText} />
          <img class="min" src=${mobileImg} alt=${altText} />
        </a>
      `;
      return html`<li id=${`content-${index}`}>${content}</li>`;
    });
    return html`<ul>
      ${listView}
    </ul>`;
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`<div class="photo-marquee">${this.contentBlocks}</div>`;
  }

  static get styles() {
    const marqueeAnimation = css`var(--marquee-animation-s, 50s)`;
    const marqueeWidth = css`var(--marquee-width, 150%)`;
    const marqueeHeight = css`var(--marquee-height, 50px)`;

    return css`
      :host {
        display: block;
        overflow: hidden;
        height: ${marqueeHeight};
      }

      img {
        height: ${marqueeHeight};
      }

      .photo-marquee {
        display: flex;
        width: ${marqueeWidth};
        animation: bannermove ${marqueeAnimation} linear infinite;
      }

      .photo-marquee:hover {
        animation-play-state: paused;
      }

      .photo-marquee ul {
        display: flex;
        margin: 0;
      }

      @keyframes bannermove {
        0% {
          transform: translate(-20%, 0);
        }

        100% {
          transform: translate(-120%, 0);
        }
      }

      @keyframes bannermove-min {
        0% {
          transform: translate(-10%, 0);
        }

        100% {
          transform: translate(-120%, 0);
        }
      }

      @media only screen and (max-width: 600px) {
        img.full {
          display: none;
        }
        .photo-marquee {
          animation: bannermove-min 10s linear infinite;
          width: 150%;
        }
      }
      @media only screen and (min-width: 601px) {
        img.min {
          display: none;
        }
      }
    `;
  }
}
