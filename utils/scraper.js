const axios = require('axios');
const cheerio = require('cheerio');
//const puppeteer = require('puppeteer');
const Course = require('../models/course');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class CourseScraper {
    constructor() {
        this.downloadDir = path.join(__dirname, '../uploads/scraped');
        if (!fs.existsSync(this.downloadDir)) {
            fs.mkdirSync(this.downloadDir, { recursive: true });
        }
    }

// Update the scrapeUdemy method in CourseScraper class
async scrapeUdemy() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--proxy-server=socks5://your-proxy-ip:port',
          '--no-sandbox'
        ]
      });
  
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
    try {
      await page.goto('https://www.udemy.com/courses/development/', {
        waitUntil: 'networkidle2',
        timeout: 60000
      });
  
      // Handle age verification popup
      try {
        await page.waitForSelector('[data-purpose="age-gate-button"]', { timeout: 3000 });
        await page.click('[data-purpose="age-gate-button"]');
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('No age verification found');
      }
  
      // Wait for main content
      await page.waitForSelector('.course-list--container--3zXPS', { timeout: 20000 });
  
      // Scroll to load content
      await this.autoScroll(page);
  
      // Extract course data with updated selectors
      const courses = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.course-card--course-card--1F8tj')).map(card => {
          const priceElement = card.querySelector('[data-purpose*="price-text"]');
          const originalPrice = priceElement?.innerText?.match(/(\d+\.\d+)/)?.[1] || '49.99';
          
          return {
            title: card.querySelector('.ud-heading-md')?.innerText?.trim() || 'Udemy Course',
            description: card.querySelector('.course-card--course-headline--2DAqq')?.innerText?.trim()?.slice(0, 150) || 'Popular online course',
            price: parseFloat(originalPrice) || 49.99,
            courseImage: card.querySelector('img[src*="course"]')?.src || '',
            objectives: card.querySelector('.course-card--course-objectives--3hXKC')?.innerText?.trim() || 'Master key concepts'
          };
        });
      });
  
      await browser.close();
      return this.processCourses(courses, 'Udemy');
  
    } catch (err) {
      await browser.close();
      throw new Error(`Scraping failed: ${err.message}`);
    }
  }
  
  // Add auto-scroll helper
  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          // Add random delay
          const scrollDelay = Math.random() * 1000 + 500;
          setTimeout(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
  
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, scrollDelay);
        }, 100);
      });
    });
  }
  
    
// Update processCourses method
async processCourses(courses, platform) {
    const processed = [];
    
    for (const course of courses) {
      try {
        const imagePath = await this.downloadImage(course.courseImage);
        
        processed.push(new Course({
          title: course.title.substring(0, 100), // Limit title length
          description: course.description.substring(0, 500),
          price: course.price > 0 ? course.price : 49.99,
          courseImage: imagePath,
          prerequisites: course.prerequisites || 'Basic computer knowledge',
          objectives: course.objectives || 'Master key concepts',
          targetAudience: 'Beginner to Advanced',
          language: 'English',
          courseDuration: Math.min(course.duration || 45, 100), // Limit duration
          rating: 4.5,
          subtitles: 'English',
          category: '681cd6575721c64499ab283d', // Validate this ID exists
          user: '681cda515721c64499ab2930'       // Validate this ID exists
        }));
      } catch (err) {
        console.error('Skipping invalid course:', err);
      }
    }
    
    return processed;
  }

// Update downloadImage method
async downloadImage(url) {
    if (!url || !url.startsWith('http')) {
      return '/uploads/default-course.png';
    }
  
    try {
      const response = await axios.head(url);
      if (!response.headers['content-type'].startsWith('image/')) {
        throw new Error('Invalid image content type');
      }
  
      const ext = response.headers['content-type'].split('/')[1] || 'png';
      const filename = `scraped-${Date.now()}.${ext}`;
      const filePath = path.join(this.downloadDir, filename);
  
      const writer = fs.createWriteStream(filePath);
      const imageResponse = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
      });
  
      imageResponse.data.pipe(writer);
  
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
  
      return `/uploads/scraped/${filename}`;
    } catch (err) {
      console.error(`Image download failed for ${url}:`, err.message);
      return '/uploads/default-course.png';
    }
  }
}

module.exports = CourseScraper;