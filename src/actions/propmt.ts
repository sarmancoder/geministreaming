"use server";

import queryPayments from "@/lib/queryPayments";

export async function promptDB() {
    const result = await queryPayments("2005-06-01", "2005-06-20");
    console.log(result);
    return {};
}
