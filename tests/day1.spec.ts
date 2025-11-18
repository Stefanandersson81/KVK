import { BrowserContext, Page, test } from '@playwright/test';
import config from '../playwright.config';
import { KodsystemPage } from '../src/pages/KodsystemPage';
import { AktivKodsystemPage } from '../src/pages/aktivKodsystemPage';
import { PopupRutorPage } from '../src/pages/PopupRutorPage';

let context: BrowserContext;
let page: Page;
let kodsystemPage: KodsystemPage;
let aktivKodsystemPage: AktivKodsystemPage;
let popupRutorPage: PopupRutorPage;

test.describe('skapar och aktivera kodystem för verifieras dag 2', () => {
  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ baseURL: config.use?.baseURL });
    page = await context.newPage();
    kodsystemPage = new KodsystemPage(page);
    aktivKodsystemPage = new AktivKodsystemPage(page);
    popupRutorPage = new PopupRutorPage(page);

    await kodsystemPage.openKodsystem();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Verifiera Kodsystem-menyer/filter att de syns och att texten finns', async () => {
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

  test('Skapa ett utkast av ett aktiv kodsystem och lägg koder och aktiver för dagen efter', async () => {
    await test.step('Öppna "Kodsystem" och välj aktivt system', async () => {
      await aktivKodsystemPage.createDraftFromActiveSystem('ASA');
    });
    await test.step('Lägg till koder i utkastet', async () => {
      await aktivKodsystemPage.addCodesToDraft(['kod-1', 'kod-2']);
    });
    await test.step('Verifiera och spara popup för lägga till kod', async () => {
      await popupRutorPage.popupRutaLaggTillKod();
    });

    await test.step('Verifiera att koden som precis lades till syns i listan', async () => {
      await aktivKodsystemPage.addCodesWithCSVToDraft();
    });

    await test.step('Redigera Versions namn och spara utkastet', async () => {
      await aktivKodsystemPage.redigeraVersionnummer();
    });

    await test.step('Verifiera popup för spara Versionummer', async () => {
      await popupRutorPage.popupRutaSparaVersionnummer();
    });

    await test.step('Verifiera koder som tillagda manuellt och CSV', async () => {
      await aktivKodsystemPage.verifyCodesAdded();
    });

    await test.step('Spara utkastet och verifera popuprutorna', async () => {
      await aktivKodsystemPage.saveDraft();
      await popupRutorPage.popupRutaSparaUtkast()
      await aktivKodsystemPage.verifyCodesAddedInTotal();
    });
  });

  

});
