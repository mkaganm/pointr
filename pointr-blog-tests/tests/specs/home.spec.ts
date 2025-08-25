import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('should get blog post titles', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigateToBlog();
    await homePage.printAllBlogPostTitles();
});
