import { test } from '../src/fixtures/baseFixtures';

test.describe('skapar och aktivera kodystem för verifieras dag 2', () => {
  test.beforeEach(async ({ kodsystemPage }) => {
    await kodsystemPage.openKodsystem();
  });

  test('Verifiera Kodsystem-menyer/filter att de syns och att texten finns', async ({ kodsystemPage }) => {
    await test.step('Öppna och verifiera sidan "Kodsystem"', async () => {
      await kodsystemPage.verifyFilterStart('Kodsystem');
    });
    await test.step('Öppna och verifiera sidan "Värdemängd"', async () => {
      await kodsystemPage.verifyFilterStart('Värdemängd');
    });
    await test.step('Öppna och verifiera sidan "Kodrelationer"', async () => {
      await kodsystemPage.verifyFilterStart('Kodrelationer');
    });
  });
});
