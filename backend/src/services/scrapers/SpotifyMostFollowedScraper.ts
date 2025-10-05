/**
 * Spotify Most Followed Artists Scraper
 * Scrapes most followed artists from Spotify data via ChartMasters
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class SpotifyMostFollowedScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'spotify-most-followed',
            name: 'Spotify Most Followed Artists',
            description: 'Scrape most followed artists from Spotify data via ChartMasters',
            url: 'https://chartmasters.org/wp-admin/admin-ajax.php',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 100,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive',
                'Referer': 'https://chartmasters.org/spotify-most-followed-artists',
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);

        try {
            const formData = 'draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=rank&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=g%23&columns%5B1%5D%5Bsearchable%5D=false&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=pic&columns%5B2%5D%5Bsearchable%5D=false&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=artist&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=followers&columns%5B4%5D%5Bsearchable%5D=false&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=daily&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=weekly&columns%5B6%5D%5Bsearchable%5D=false&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=artist_spotify_id&columns%5B7%5D%5Bsearchable%5D=false&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=8&columns%5B8%5D%5Bname%5D=gender&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=false&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=9&columns%5B9%5D%5Bname%5D=genre&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=false&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=10&columns%5B10%5D%5Bname%5D=country&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=false&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=11&columns%5B11%5D%5Bname%5D=language&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=false&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=100&search%5Bvalue%5D=&search%5Bregex%5D=false&wdtNonce=f921317402';

            const response = await axios.post(
                'https://chartmasters.org/wp-admin/admin-ajax.php?action=get_wdtable&table_id=65',
                formData,
                {
                    timeout: this.config.timeout,
                    headers: this.config.headers
                }
            );

            const responseData = response.data;

            if (!responseData || !responseData.data) {
                throw new Error('Invalid response structure from ChartMasters API');
            }

            const artists = responseData.data;

            if (!Array.isArray(artists) || artists.length === 0) {
                throw new Error('No artist data found in ChartMasters response');
            }

            const transformedArtists = artists.map((artist: any, index: number) => ({
                rank: artist[0] || index + 1,
                artist: cheerio.load(artist[3]).text().trim() || '',
                followers: artist[4] || '',
                dailyChange: artist[5] || '',
                weeklyChange: artist[6] || '',
                spotifyId: artist[7] || '',
                gender: artist[8] || '',
                genre: artist[9] || '',
                country: artist[10] || '',
                language: artist[11] || ''
            }));

            const limitedData = this.applyLimit(transformedArtists, options?.limit);

            return {
                data: limitedData,
                recordCount: limitedData.length,
                metadata: {
                    duration: 0,
                    url: this.config.url,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            console.error('Error scraping Spotify Most Followed Artists:', error);
            throw new Error(`Failed to scrape Spotify Most Followed Artists: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}