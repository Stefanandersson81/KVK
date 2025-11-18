import { test as base } from '@playwright/test';
import { KodsystemPage } from '../pages/KodsystemPage';

type Fixtures = {
  kodsystemPage: KodsystemPage;
};

export const test = base.extend<Fixtures>({
  kodsystemPage: async ({ page }, use) => {
    const kodsystemPage = new KodsystemPage(page);
    await use(kodsystemPage);
  },
});

export { expect } from '@playwright/test';
