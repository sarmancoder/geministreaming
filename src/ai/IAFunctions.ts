type IAResponse<T> = Promise<string | undefined | T>;

type IAFunction<T> = (userPrompt: string, stream?: boolean) => IAResponse<T>;

export default interface IAFunctions<T> {
    getAnalyticsFor: IAFunction<T>;
    // getRevenueByMonth: IAFunction<T>;
}
