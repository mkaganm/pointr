import { Page, Locator } from '@playwright/test';

export class BlogPage {
    readonly page: Page;
    readonly fullUrl: string;

    constructor(page: Page, fullUrl: string) {
        this.page = page;
        this.fullUrl = fullUrl;
    }

    async navigateToBlogPost() {
        await this.page.goto(this.fullUrl);
        console.log(`Navigated to blog post: ${this.fullUrl}`);
    }

    async getBlogText(): Promise<string | null> {
        const blogTextElement = this.page.locator('//*[@id="blog_post_main"]/div/div/div[3]');
        console.log(`Blog text element: ${blogTextElement}`);
        return await blogTextElement.textContent();
    }
}
