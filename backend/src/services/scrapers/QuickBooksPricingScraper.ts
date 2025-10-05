/**
 * QuickBooks Pricing Scraper
 * Scrapes QuickBooks pricing plans and offers
 */

import axios from 'axios';
import { BaseScraper, ScraperConfig, ScraperResult, ScrapingOptions } from '../base/BaseScraper';

export class QuickBooksPricingScraper extends BaseScraper {
    constructor() {
        const config: ScraperConfig = {
            id: 'quickbooks-pricing',
            name: 'QuickBooks Pricing',
            description: 'Scrape QuickBooks pricing plans and offers',
            url: 'https://quickbooks.intuit.com/qbmds-data/us/billing_offers_us.json?v4=5',
            enabled: true,
            supportedFormats: ['json', 'csv'],
            defaultFormat: 'json',
            estimatedRecords: 4,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        };
        super(config);
    }

    async scrape(options?: ScrapingOptions): Promise<ScraperResult> {
        this.validateOptions(options);

        try {
            const response = await axios.get(
                'https://quickbooks.intuit.com/qbmds-data/us/billing_offers_us.json?v4=5',
                {
                    timeout: this.config.timeout,
                    headers: this.config.headers
                }
            );

            const data = response.data;
            const campaigns = data?.campaigns?.default?.default?.QBO;

            if (!campaigns) {
                throw new Error('Invalid QuickBooks pricing data structure');
            }

            const simpleStartOfferID = campaigns.QBO_SIMPLE_START?.MONTHLY?.PAID?.offer_id;
            const essentialsOfferID = campaigns.QBO_ESSENTIALS?.MONTHLY?.PAID?.offer_id;
            const plusOfferID = campaigns.QBO_PLUS?.MONTHLY?.PAID?.offer_id;
            const advancedOfferID = campaigns.QBO_ADVANCED?.MONTHLY?.PAID?.offer_id;

            const offerIDs = [simpleStartOfferID, essentialsOfferID, plusOfferID, advancedOfferID].filter(Boolean);
            const pricingData: any[] = [];

            for (const offerID of offerIDs) {
                const offer = data.offerDefinitions?.[offerID];
                if (!offer) {
                    console.warn(`Offer not found with ID ${offerID}`);
                    continue;
                }

                const offerNameMatch = offer.name?.match(/QBO\s*(.*?)\s*US/);
                const planName = offerNameMatch?.[1];

                if (!planName) {
                    console.warn(`Could not extract plan name from offer: ${offer.name}`);
                    continue;
                }

                if (
                    offer.discountDuration == null ||
                    offer.discountUnit == null ||
                    offer.discountPriceWhole == null
                ) {
                    console.warn(`Missing required offer info for ${planName}`);
                    continue;
                }

                pricingData.push({
                    plan: planName,
                    price: Number(offer.basePrice || 0),
                    discountedPrice: Number(`${offer.discountPriceWhole}.${offer.discountPriceCents || 0}`),
                    category: planName,
                    discountDuration: offer.discountDuration.toString(),
                    discountUnit: offer.discountUnit,
                    offerName: offer.name,
                    offerId: offerID
                });
            }

            if (pricingData.length === 0) {
                throw new Error('No QuickBooks pricing data could be extracted');
            }

            const limitedData = this.applyLimit(pricingData, options?.limit);

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
            console.error('Error scraping QuickBooks pricing:', error);
            throw new Error(`Failed to scrape QuickBooks pricing: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}