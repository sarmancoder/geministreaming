"use server";

import getAnalyticsFor from "@/ai/google/getAnalyticsFor";

export async function promptDB(userPrompt: string) {
    // const result = await queryPayments("2005-06-01", "2005-06-20");
    // console.log(result);
    return await getAnalyticsFor(userPrompt);
}
