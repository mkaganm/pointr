import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BlogPage } from '../pages/BlogPage';
import { writeFileSync } from 'fs';

test('should open blog detail page', async ({ page, browserName }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigateToBlog();
    const links = await homePage.getFirstThreeBlogPostLinks();
    
    let blogTexts: string[] = [];
    let wordCountMap = new Map<string, number>();
    
    // Navigate to all blog posts
    for (let i = 0; i < links.length; i++) {
        const blogPage = new BlogPage(page, links[i]);
        await blogPage.navigateToBlogPost();
        
        const blogText = await blogPage.getBlogText();
        if (blogText) {
            blogTexts.push(blogText);
        }
    }

    processBlogTexts(blogTexts, browserName);
});

function processBlogTexts(blogTexts: string[], browserName: string) {
    let wordCountMap = new Map<string, number>();
    
    for (let i = 0; i < blogTexts.length; i++) {
        let blogText = blogTexts[i];

        // split blog text into words
        let words = blogText.split(' ');

        // iterate through each word
        for (let j = 0; j < words.length; j++) {
            let word = words[j];
            
            if (wordCountMap.has(word)) {
                wordCountMap.set(word, wordCountMap.get(word)! + 1);
            } else {
                wordCountMap.set(word, 1);
            }
        }
    }

    // Get top 5 most repeated words
    let topWordsMap = new Map<string, number>();
    let sortedWords = Array.from(wordCountMap.entries()).sort((a, b) => b[1] - a[1]);
    
    for (let i = 0; i < Math.min(5, sortedWords.length); i++) {
        topWordsMap.set(sortedWords[i][0], sortedWords[i][1]);
    }

    // Save to txt file
    let fileContent = '';
    
    topWordsMap.forEach((count, word) => {
        fileContent += `${word}: ${count}\n`;
    });
    
    console.log(fileContent);
    writeFileSync(`top_words_${browserName}.txt`, fileContent);
}
