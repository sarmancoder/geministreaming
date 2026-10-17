import dbConnection from "@/db";

export default async function queryPayments(
    firstDate: string,
    secondDate: string,
) {
    const querySTR = `
SELECT p.* FROM payment p
JOIN rental r ON r.rental_id = p.rental_id
JOIN inventory i ON i.inventory_id = r.inventory_id
JOIN film f ON f.film_id = i.film_id
WHERE p.payment_date BETWEEN '${firstDate}' AND '${secondDate}'
ORDER BY p.payment_date desc
`;
    console.log(querySTR);
    const query = await dbConnection.query(querySTR);

    return query;
}
