import { test as base } from '@playwright/test';
import { KodsystemPage } from '../pages/KodsystemPage';
import { AktivKodsystemPage } from '../pages/aktivKodsystemPage';
import { PopupRutorPage } from '../pages/PopupRutorPage';

type Fixtures = {
  kodsystemPage: KodsystemPage;
  aktivKodsystemPage: AktivKodsystemPage;
  popupRutorPage: PopupRutorPage;
};

export const test = base.extend<Fixtures>({
  kodsystemPage: async ({ page }, use) => {
    const kodsystemPage = new KodsystemPage(page);
    await use(kodsystemPage);
  },
  aktivKodsystemPage: async ({ page }, use) => {
    const aktivKodsystemPage = new AktivKodsystemPage(page);
    await use(aktivKodsystemPage);
  },
  popupRutorPage: async ({ page }, use) => {
    const popupRutorPage = new PopupRutorPage(page);
    await use(popupRutorPage);
  },
});

export { expect } from '@playwright/test';
