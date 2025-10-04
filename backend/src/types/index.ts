/**
 * TypeScript type definitions for Scrapify Backend
 */

// Scraping request/response types
export interface ScrapingRequest {
    source: string;
    format: 'json' | 'csv' | 'xml';
    options?: {
        limit?: number;
        timeout?: number;
        headers?: Record<string, string>;
    };
}

export interface ScrapingResponse {
    success: boolean;
    data?: any;
    error?: string;
    metadata: {
        source: string;
        format: string;
        timestamp: string;
        duration: number;
        recordCount?: number;
    };
}

// Scraping source configuration
export interface ScrapingSource {
    id: string;
    name: string;
    description: string;
    url: string;
    enabled: boolean;
    supportedFormats: ('json' | 'csv' | 'xml')[];
    defaultFormat: 'json' | 'csv' | 'xml';
    estimatedRecords?: number;
    lastUpdated?: string;
}

// API response wrapper
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}

// Health check response
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    uptime: number;
    timestamp: string;
    version: string;
    environment: string;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
}

// Error types
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

// Turing Jobs API Response
export interface TuringJob {
    jobId: string;
    createdDate: string;
    updatedDate: string;
    industry: null | string;
    customerWeeklyHourEngagement: null;
    publishedOnJobBoard: string;
    skillsExpression: SkillsExpression;
    optionalSkills: OptionalSkill[];
    role: string;
    companySize: null | number;
    publicTitle: string;
    isActive: boolean;
    jobLanguageContent: (JobLanguageContent | JobLanguageContent2 | JobLanguageContent3 | JobLanguageContent4)[];
    showOnJobBoard: boolean;
    fulfilmentProbability: string;
    directApplyUrl: string;
    requiredSkills: OptionalSkill[];
    description: string;
}

interface JobLanguageContent4 {
    languageId: number;
    abbreviation: string;
    language: string;
    publicDescription: null | string;
    publicTitle: null;
    publishedOnJobBoard: string;
}

interface JobLanguageContent3 {
    languageId: number;
    abbreviation: string;
    language: string;
    publicDescription: string;
    publicTitle: null;
    publishedOnJobBoard: string;
}

interface JobLanguageContent2 {
    languageId: number;
    abbreviation: string;
    language: string;
    publicDescription: null;
    publicTitle: null;
    publishedOnJobBoard: string;
}

interface JobLanguageContent {
    languageId: number;
    abbreviation: string;
    language: string;
    publicDescription: string;
    publicTitle: null | string;
    publishedOnJobBoard: string;
}

interface OptionalSkill {
    id: number;
    name: string;
}

interface SkillsExpression {
    operator: string;
    children: Child2[];
}

interface Child2 {
    operator: string;
    children: Child[];
}

interface Child {
    skill: number;
    yearsOfExperience: number;
    name: string;
}

// GitHub Most Starred API Response
export interface GitHubRepoOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
}
export interface GitHubRepo {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: GitHubRepoOwner;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    forks_count: number;
    open_issues_count: number;
    license?: {
        key: string;
        name: string;
        spdx_id: string;
        url: string;
        node_id: string;
    };
    topics?: string[];
    visibility: string;
    default_branch: string;
    [key: string]: any;
}
export interface GitHubMostStarredApiResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubRepo[];
}

// NewsAPI Top Headlines Response (best guess)
export interface NewsApiArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}
export interface NewsApiTopHeadlinesResponse {
    status: string;
    totalResults: number;
    articles: NewsApiArticle[];
}
