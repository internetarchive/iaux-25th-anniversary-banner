import { html, css, LitElement, customElement, property } from 'lit-element';
import { TimelineMoment } from '../src/interfaces';

enum DevMenuViewMode {
  Open = 'open',
  Closed = 'closed',
}
@customElement('dev-tray')
export class DevTray extends LitElement {
  @property({ type: String }) viewMode: DevMenuViewMode = DevMenuViewMode.Open;

  @property({ type: Array }) momentsDisplayed: TimelineMoment[] = [];

  directorySubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const directory = (form[0] as HTMLInputElement).value;
    if (!directory) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('directoryChange', {
        detail: { directory },
      })
    );
  }

  bannerColorSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const bannerColor = (form[0] as HTMLInputElement).value;

    this.dispatchEvent(
      new CustomEvent('bannerColorChange', {
        detail: { bannerColor },
      })
    );
  }

  bannerHeightSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const bannerHeight = (form[0] as HTMLInputElement).value;
    if (!parseInt(bannerHeight, 10)) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('bannerHeightChange', {
        detail: { bannerHeight },
      })
    );
  }

  bannerTimingSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const bannerTiming = (form[0] as HTMLInputElement).value;
    if (!parseInt(bannerTiming, 10)) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('bannerTimingChange', {
        detail: { bannerTiming },
      })
    );
  }

  toggleViewMode() {
    if (this.viewMode === DevMenuViewMode.Open) {
      this.viewMode = DevMenuViewMode.Closed;
    } else {
      this.viewMode = DevMenuViewMode.Open;
    }
  }

  get displayMoments() {
    if (!this.momentsDisplayed.length) {
      return html`no moments found`;
    }

    return this.momentsDisplayed.map((m: TimelineMoment) => {
      return html`
        <li>
          <p><b>To:</b> ${m.link}</p>
          <p><b>altText:</b> ${m.altText}</p>
          <div class="images">
            <span class="mobile"
              >Mobile:
              <img class="thumbnail-img" src="${m.mobileImg}" alt=${m.altText}
            /></span>
            <span class="desktop"
              >Desktop:
              <img class="thumbnail-img" src="${m.desktopImg}" alt=${m.altText}
            /></span>
          </div>
        </li>
      `;
    });
  }

  render() {
    const buttonName =
      this.viewMode === DevMenuViewMode.Open
        ? 'Close banner options'
        : 'Open banner options';
    return html`
      <div class=${this.viewMode}>
        <button @click=${this.toggleViewMode} class="toggle">
          ${buttonName}
        </button>
        <p>add value + press enter</p>
        <div class="options">
          <form @submit=${this.directorySubmit}>
            <label
              >Directory (<a
                href="https://archive.org/download/isa-9001599455299596"
                target="_blank"
                >available dirs</a
              >): <input type="text"
            /></label>
          </form>
          <br />
          <form @submit=${this.bannerColorSubmit}>
            <label>Banner Color in hex: <input type="text" /></label>
          </form>
          <br />
          <form @submit=${this.bannerHeightSubmit}>
            <label>Banner Height in px: <input type="number" /></label>
          </form>
          <br />
          <form @submit=${this.bannerTimingSubmit}>
            <label
              >Banner Animation Timing in seconds: <input type="number"
            /></label>
          </form>
        </div>
        <div class="thumbnails">
          <p><b>Moments found:</b> ${this.momentsDisplayed.length}</p>
          <ol>
            ${this.displayMoments}
          </ol>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        margin-top: 100px;
        border: 1px solid blue;
        padding: 10px;
        overflow: hidden;
        font-size: 14px;
      }

      .open {
        width: 500px;
      }

      .options {
        margin: 10px auto;
      }

      .closed {
        width: 50px;
      }
      .closed .options,
      .closed .thumbnails {
        display: none;
      }

      .thumbnails {
        width: 500px;
        word-wrap: break-word;
      }

      .images * {
        display: inline-block;
        height: 30px;
      }

      ol {
        height: 300px;
        overflow: auto;
        padding: 20px;
        border: 1px solid blueviolet;
      }

      li:nth-child(even) {
        background: aliceblue;
      }

      li:nth-child(odd) {
        background: #ffe5e5;
      }
    `;
  }
}
