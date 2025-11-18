import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for common popup dialogs used in kodsystem flows.
 */
export class PopupRutorPage extends BasePage {
  protected readonly defaultPath = '/';

  constructor(page: Page) {
    super(page);
  }

  protected async waitForReady(): Promise<void> {
    // No-op: popups are invoked from already loaded pages.
  }

  async popupRutaLaggTillKod(): Promise<void> {
    await expect(this.page.locator('[data-test-id=\"app-button-icon--close--app-modal\"]')).toBeVisible();
    await expect(this.page.locator('#modalheader')).toContainText('Lägg till koden');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"] div')).toContainText('Koden läggs till när kodsystemsutkastet sparas.');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"] [data-test-id=\"app-button\"]')).toContainText('OK');
    await this.page.locator('[data-test-id=\"modal-body--app-modal\"] [data-test-id=\"app-button\"]').click();
    await this.page.waitForTimeout(4000);
    await expect(this.page.getByText('SökSökSökÄndrade: 0 Ny: 1')).toBeVisible();
    await expect(this.page.locator('[data-test-id=\"app-table-body\"]')).toContainText(/123456789/i);
    /*await expect(this.page.locator('#content')).toContainText('Avbryt');
    await expect(this.page.locator('#content')).toContainText('Spara');
    await this.page.getByRole('button', { name: 'Spara' }).click();
    await this.page.waitForTimeout(4000);
    await expect(this.page.locator('[data-test-id=\"app-button-icon--close--app-modal\"]')).toBeVisible();*/
  }

  async popupRutaSparaKod(): Promise<void> {
    await this.waitForReady();
    await expect(this.page.locator('#modalheader')).toContainText('Vill du spara?');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Vill du spara följande ändringar och skapa ett kodsystemsutkast? Kod som inaktiveras tas automatiskt bort i värdemängder och kodrelationer där den ingår.');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Nya och ändrade koder');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"] [data-test-id=\"app-table-body\"]').first().getByRole('row')).toContainText('123456789');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Vill du spara följande ändringar och skapa ett kodsystemsutkast?');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Ja');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]').getByRole('link')).toContainText('Nej');
    await this.page.getByRole('button', { name: 'Ja' }).click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'Ok' }).click();
    await this.page.waitForTimeout(5000);

  }
  async popupRutaSparaVersionnummer(): Promise<void> {
    await this.waitForReady();
    await expect(this.page.locator('#modalheader')).toContainText('Vill du gå vidare?');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Ändringarna läggs till när kodsystemsutkastet sparas.');
    await this.page.getByRole('button', { name: 'Ok' }).click();
    await this.page.waitForTimeout(3000);
  }
  async popupRutaSparaUtkast(): Promise<void> {
    await this.waitForReady();
    await expect(this.page.locator('#modalheader')).toContainText('Vill du spara?');
    await expect(this.page.locator('[data-test-id=\"modal-body--app-modal\"]')).toContainText('Vill du spara följande ändringar och skapa ett kodsystemsutkast?');

    const rows = this.page.locator('[class="summary"] [data-test-id="app-table"]  [data-test-id="row--app-table-row"]');
    await expect(rows).toHaveCount(15);
    await this.page.locator('[class="summary"]').nth(2).click();
    const row = this.page.locator('[data-test-id=\"modal-body--app-modal\"] [data-test-id="app-table"]  [data-test-id="row--app-table-row"]');
    await expect(row).toHaveCount(24);
     await this.page.getByRole('button', { name: 'Ja' }).click();
     await this.page.waitForTimeout(5000);
     await this.page.getByRole('button', { name: 'Ok' }).click();
     await this.page.waitForTimeout(5000); 
  }
}
