type IAResponse<T> = Promise<string | undefined | T>;

export default interface IAFunctions<T> {
    getAnalyticsFor: (userPrompt: string, stream?: boolean) => IAResponse<T>;
}
