import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TodoPage extends BasePage {
  protected readonly defaultPath = '/';

  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = this.page.getByPlaceholder('What needs to be done?');
    this.todoItems = this.page.locator('.todo-list li');
    this.filterAll = this.page.getByRole('link', { name: 'All' });
    this.filterActive = this.page.getByRole('link', { name: 'Active' });
    this.filterCompleted = this.page.getByRole('link', { name: 'Completed' });
  }

  protected async waitForReady(): Promise<void> {
    await expect(this.newTodoInput).toBeVisible();
  }

  async addTodo(label: string): Promise<void> {
    await this.newTodoInput.fill(label);
    await this.newTodoInput.press('Enter');
  }

  async toggleTodo(label: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: label });
    await item.getByRole('checkbox').check();
  }

  async deleteTodo(label: string): Promise<void> {
    const item = this.todoItems.filter({ hasText: label });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async filterByActive(): Promise<void> {
    await this.filterActive.click();
  }

  async filterByCompleted(): Promise<void> {
    await this.filterCompleted.click();
  }

  async filterByAll(): Promise<void> {
    await this.filterAll.click();
  }

  async todos(): Promise<string[]> {
    return this.todoItems.allTextContents();
  }
}
