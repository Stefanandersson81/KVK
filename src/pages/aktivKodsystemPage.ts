import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import { BasePage } from './BasePage';

/**
 * Page object focused on flows for active kodsystem.
 */
export class AktivKodsystemPage extends BasePage {
  protected readonly defaultPath = '/';

  private readonly kodsystemLink: Locator;
  private readonly contentArea: Locator;
  private readonly testInputs: Locator;
  private readonly testTextarea: Locator;
  private readonly appButtons: Locator;
  private readonly tableBody: Locator;
  private readonly tableCells: Locator;
  private readonly editSystemButton: Locator;
  private readonly importButton: Locator;
  private readonly fileInput: Locator;

  constructor(page: Page) {
    super(page);
    this.kodsystemLink = this.page.getByRole('link', { name: 'Kodsystem' }).first();
    this.contentArea = this.page.locator('#content');
    this.testInputs = this.page.locator('[data-test-id="test-input"]');
    this.testTextarea = this.page.locator('[data-test-id="test-textarea"]');
    this.appButtons = this.page.locator('[data-test-id="app-button"]');
    this.tableBody = this.page.locator('[data-test-id="app-table-body"]');
    this.tableCells = this.page.locator('[data-test-id="app-table-cell"]');
    this.editSystemButton = this.page.getByRole('button', { name: 'Redigera kodsystem' });
    this.importButton = this.page.getByRole('button', { name: 'Importera koder från fil' });
    this.fileInput = this.page.locator('[data-test-id="input-test"]');
  }

  protected async waitForReady(): Promise<void> {
    await expect(this.kodsystemLink).toBeVisible();
  }

  async openKodsystem(): Promise<void> {
    await this.waitForReady();
    await this.kodsystemLink.click();
    await this.page.waitForTimeout(500);

    const firstRow = this.page.locator('tbody tr').first();
    await this.page.waitForTimeout(1000);
    await this.testInputs.first().fill('ASA-klasser');
    await this.appButtons.filter({ hasText: 'Sök' }).click();
    await this.page.waitForTimeout(3000);
    await expect(firstRow).toContainText(/ASA-klasser/i);

    this.page.locator('tr', { hasText: 'Aktiv' }).click();
    await this.page.waitForTimeout(2000);
    await this.ensureEditMode();
  }

  async createDraftFromActiveSystem(systemName: string): Promise<void> {
    await this.openKodsystem();
    console.log(`[aktivKodsystem] create draft from active system: ${systemName}`);
  }

  async addCodesToDraft(codes: string[]): Promise<void> {
    await this.waitForReady();
    await this.page.getByRole('button', { name: 'Skapa kod' }).click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByRole('heading')).toContainText('Skapa kod');
    await expect(this.contentArea).toContainText('Kodsystem');
    await expect(this.contentArea).toContainText('Kod*');
    await expect(this.contentArea).toContainText('Term*');
    await expect(this.contentArea).toContainText('Synonym');
    await expect(this.contentArea).toContainText('Synonym i plural');
    await expect(this.contentArea).toContainText('Förkortning');
    await expect(this.contentArea).toContainText('Kommentarer');
    await expect(this.page.getByRole('button', { name: 'Avbryt' })).toBeVisible();
    await expect(this.contentArea).toContainText(
      'Koden som nu skapas kan läggas till i värdemängder och kodrelationer när kodsystemsversionen blivit aktiv.'
    );

    const draftFields = ['123456789', 'kod för system', 'Synonym', 'Synonym i plural', 'Förkortning'];
    for (let index = 0; index < draftFields.length; index += 1) {
      await this.testInputs.nth(index).fill(draftFields[index]);
    }

    await this.testTextarea.fill('Kommentar för test av att Skapa KOD');
    await expect(this.contentArea).toContainText('Lägg till');
    await this.page.getByRole('button', { name: 'Lägg till' }).click();
    await this.page.waitForTimeout(2000);
  }

  async addCodesWithCSVToDraft(codes: string[] = []): Promise<void> {
    await this.waitForReady();
    const csvPath = path.join(process.cwd(), 'fixtures', 'test.csv');

    await this.ensureEditMode();

    // If disabled, it should become enabled after file selection.
    await this.fileInput.setInputFiles(csvPath);
    await this.page.waitForTimeout(500);

    if (await this.importButton.isDisabled({ timeout: 2000 }).catch(() => false)) {
      await expect(this.importButton).toBeEnabled();
    }

    await this.importButton.click();
    await this.page.waitForTimeout(3000);
    await this.appButtons.filter({ hasText: 'Ja' }).click();
    await this.page.waitForTimeout(3000);
  }

  async verifyCodesAdded(): Promise<void> {
    await this.waitForReady();
    await expect(this.tableBody).toContainText(/123456789/i);
    await expect(this.tableBody).toContainText(/Ny/i);
    await expect(this.tableBody).toContainText(/enKodSomHärskarÖverAlla/i);
  }

  async redigeraVersionnummer(): Promise<void> {
    await this.waitForReady();
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Redigera information om kodsystem' }).click();
    await this.page.waitForTimeout(2000);
    await this.page.locator('[data-test-id="test-input"]').nth(1).fill('Version 1.0.1');
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Vidare' }).click();
    await this.page.waitForTimeout(2000);
  }

  async saveDraft(): Promise<void> {
    await this.waitForReady();
    await this.page.locator('[data-test-id="app-button"]', { hasText: 'Spara' }).click();
    await this.page.waitForTimeout(2000);
    const dialogText = this.page.getByText('Vill du spara följande ändringar och skapa ett kodsystemsutkast?', {
      exact: true,
    });
    await expect(dialogText).toBeVisible();
  }

  async verifySaveDraft(): Promise<void> {
    await this.waitForReady();
    await this.expectCellsToContain(['kod1', 'kod4', 'enKodSomHärskarÖverAlla']);
  }

  async verifyCodesAddedInTotal(): Promise<void> {
    await this.waitForReady();
    await this.expectCellsToContain(['123456789', 'enKodSomHärskarÖverAlla']);
  }

  private async ensureEditMode(): Promise<void> {
    if (await this.editSystemButton.isVisible()) {
      await this.editSystemButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  private async expectCellsToContain(values: string[]): Promise<void> {
    for (const value of values) {
      const matchingCells = this.tableCells.filter({ hasText: value });
      const count = await matchingCells.count();
      expect(count).toBeGreaterThan(0);
    }
  }

  async aktiverUtkastet(): Promise<void> {
    await this.waitForReady();
    await this.kodsystemLink.click();
    await this.page.waitForTimeout(500);

    const firstRow = this.page.locator('tbody tr').first();
    await this.page.waitForTimeout(1000);
    await this.testInputs.first().fill('ASA-klasser');
    await this.appButtons.filter({ hasText: 'Sök' }).click();
    await this.page.waitForTimeout(3000);
    await expect(firstRow).toContainText(/ASA-klasser/i);

    this.page.locator('tr', { hasText: 'Utkast' }).click();
    await this.page.waitForTimeout(2000);

    // Klicka "Aktivera"
    const aktiveraBtn = this.page.locator('[data-test-id="app-button"]', { hasText: 'Aktivera' });
    await aktiveraBtn.click();



  }
}
