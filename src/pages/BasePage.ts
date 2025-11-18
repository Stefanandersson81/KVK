import { Page } from '@playwright/test';

type OpenOptions = {
  /**
   * Relative or absolute path to open. Defaults to the page's defaultPath.
   */
  path?: string;
  /**
   * Whether to run the ready check after navigation. Defaults to true.
   */
  waitForReady?: boolean;
};

/**
 * Base page object to standardize navigation and readiness across all pages.
 * Child classes set defaultPath (relative to baseURL) and override waitForReady.
 */
export abstract class BasePage {
  protected abstract readonly defaultPath: string;
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the page to be ready. Subclasses must implement this.
   */
  protected abstract waitForReady(): Promise<void>;

  /**
   * Open the page and wait for it to be ready by default.
   */
  async open(options: OpenOptions = {}): Promise<void> {
    const path = options.path ?? this.defaultPath;
    await this.goto(path);

    const shouldWait = options.waitForReady ?? true;
    if (shouldWait) {
      await this.waitForReady();
    }
  }

  async goto(path = './'): Promise<void> {
    const baseURL = (this.page.context() as any)?._options?.baseURL as string | undefined;
    const isBasePath = path === '' || path === '/' || path === './';

    // If caller wants "home", honor the configured baseURL (which may include hash/query).
    if (isBasePath && baseURL) {
      await this.navigate(baseURL);
      return;
    }
    // Allow hash-only routes when baseURL already has a hash entry point.
    if (baseURL && path.startsWith('#') && baseURL.includes('#')) {
      const [origin] = baseURL.split('#');
      await this.navigate(`${origin}${path}`);
      return;
    }
    // Resolve relative paths against baseURL when available.
    if (baseURL && !path.startsWith('http')) {
      const target = new URL(path === './' ? '/' : path, baseURL).toString();
      await this.navigate(target);
      return;
    }
    // Fallback: navigate to the provided path as-is.
    await this.navigate(path === './' ? '/' : path);
  }

  /**
   * Internal navigation helper that delegates to Playwright's page.goto.
   * It accepts either an absolute URL or a path that will be resolved against baseURL.
   */
  protected async navigate(urlOrPath: string): Promise<void> {
    await this.page.goto(urlOrPath);
  }
}
