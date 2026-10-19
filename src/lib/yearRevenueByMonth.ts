import dbConnection from "@/db";

export default async function yearRevenueByMonth(year: number) {
    const queryStr = `SELECT SUM(p.amount) as cantidad, r.rental_id, address.address,
    MONTH(p.payment_date) as mes, YEAR(p.payment_date) as año
    FROM payment p
    JOIN rental r ON r.rental_id = p.rental_id
    JOIN inventory i ON i.inventory_id = r.inventory_id
    JOIN store s ON i.store_id = i.store_id
    JOIN address address ON s.address_id = s.address_id
    where YEAR(p.payment_date) = ${year}
    group by YEAR(p.payment_date), MONTH(p.payment_date)`;

    const query = await dbConnection.query(queryStr);

    return query;
}
