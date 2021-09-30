import { html, fixture, expect } from '@open-wc/testing';

import type { IaAnniversaryBanner } from '../src/ia-anniversary-banner';
import '../src/ia-anniversary-banner';

describe('IaAnniversaryBanner', () => {
  it('defaults', async () => {
    const el = await fixture<IaAnniversaryBanner>(
      html`<ia-anniversary-banner></ia-anniversary-banner>`
    );

    expect(el.hideBannerDays).to.equal(3);
    expect(el.viewMode).to.equal('open');
  });

  it('emits event: `bannerClick` when banner is clicked', async () => {
    const el = await fixture<IaAnniversaryBanner>(
      html`<ia-anniversary-banner></ia-anniversary-banner>`
    );
    let clickHappened = false;
    const setClick = () => {
      clickHappened = true;
    };
    el.addEventListener('bannerClick', setClick);
    el.shadowRoot!.querySelector('a')!.click();

    expect(clickHappened).to.equal(true);
  });

  it('emits event: `bannerClosed` when clicked', async () => {
    const el = await fixture<IaAnniversaryBanner>(
      html`<ia-anniversary-banner></ia-anniversary-banner>`
    );
    let clickHappened = false;
    const setClick = () => {
      clickHappened = true;
    };
    el.addEventListener('bannerClosed', setClick);
    el.shadowRoot!.querySelector('button')!.click();

    expect(clickHappened).to.equal(true);
  });
});
