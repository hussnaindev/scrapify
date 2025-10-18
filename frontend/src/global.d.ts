/// <reference types="vite/client" />

declare global {
    interface Window {
        FS?: any;
    }
}

// Add FullStory types if needed
declare module '@fullstory/browser' {
    export function init(config: { orgId: string }): void;
    export function identify(uid: string, userVars?: Record<string, any>): void;
    export function setUserVars(userVars: Record<string, any>): void;
    export function event(name: string, properties?: Record<string, any>): void;
    // Add other methods as needed
}

export { };

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}
