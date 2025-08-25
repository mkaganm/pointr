import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToBlog() {
        await this.page.goto('https://www.pointr.tech/blog');
    }

    async getBlogPostTitle(index: number): Promise<string | null> {
        const titleElement = this.page.locator(`//*[@id="hs_cos_wrapper_dnd_area-module-4"]/section/div/div/div[2]/div[${index + 1}]/div/div[1]/div[2]/span/a`);
        return await titleElement.textContent();
    }

    async printAllBlogPostTitles() {
        const listContainer = this.page.locator('//*[@id="hs_cos_wrapper_dnd_area-module-4"]/section/div/div/div[2]');
        const listItems = listContainer.locator('div');
        const count = await listItems.count();
        
        console.log(`Total ${count} blog posts found:`);
        
        for (let i = 0; i < 9; i++) {
            const title = await this.getBlogPostTitle(i);
            console.log(`${i + 1}. ${title}`);
        }
    }

    async getAllBlogPostTitles(): Promise<string[]> {
        const listContainer = this.page.locator('//*[@id="hs_cos_wrapper_dnd_area-module-4"]/section/div/div/div[2]');
        const listItems = listContainer.locator('div');
        const count = await listItems.count();
        const titles: string[] = [];
        
        for (let i = 0; i < count; i++) {
            const title = await this.getBlogPostTitle(i);
            if (title) {
                titles.push(title);
            }
        }
        
        return titles;
    }

    async getFirstThreeBlogPostLinks(): Promise<string[]> {
        const links: string[] = [];
        
        for (let i = 0; i < 3; i++) {
            const linkElement = this.page.locator(`//*[@id="hs_cos_wrapper_dnd_area-module-4"]/section/div/div/div[2]/div[${i + 1}]/div/div[1]/div[2]/span/a`);
            const href = await linkElement.getAttribute('href');
            if (href) {
                links.push(href);
            }
        }
        
        console.log('First 3 blog links:');
        links.forEach((link, index) => {
            console.log(`${index + 1}. ${link}`);
        });
        
        return links;
    }
}
