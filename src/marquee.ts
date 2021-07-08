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

@customElement('ia-anniversary-marquee')
export class IaAnniversaryBanner extends LitElement {
  @property({ type: Array }) list: TimelineMoment[] = [];

  @property({ type: String }) animationState: AnimationState = 'animate';

  @property({ type: String }) defaultLink = '';

  get contentBlocks() {
    const listView = this.list.map((moment: TimelineMoment, index) => {
      const {
        altText,
        desktopImg,
        mobileImg,
        link = this.defaultLink,
      } = moment;
      const content = html`
        <a
          class="content-block"
          href=${link}
          rel="nofollow"
          title=${altText}
          data-event-click-tracking="Anniv25Banner|TimelineMoment"
        >
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
        height: inherit;
        width: 100%;
        display: flex;
        animation: bannermove ${marqueeAnimation} linear infinite;
      }

      .photo-marquee:hover {
        animation-play-state: paused;
      }

      .photo-marquee ul {
        display: flex;
        margin: 0;
        list-style: none;
        padding: 0;
      }

      .content-block {
        overflow: hidden;
        display: inline-block;
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

      @media (prefers-reduced-motion) {
        .photo-marquee {
          overflow-x: auto;
          overflow-y: hidden;
          animation: none;
        }
      }

      @media only screen and (max-width: 600px) {
        img.full {
          display: none;
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
