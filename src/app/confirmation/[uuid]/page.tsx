"use server";

import { getRentalAgreementFromDb, getToolByToolCodeFromDb } from "@/app/utils";
import dayjs from "dayjs";

export default async function Confirmation({
  params,
}: {
  params: { uuid: string };
}) {
  const rentalAgreement = await getRentalAgreementFromDb(params.uuid);
  const tool = await getToolByToolCodeFromDb(rentalAgreement[0].tool_code);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {rentalAgreement && (
          <div>
            <h1>Rental Agreement</h1>
            <p>
              <b>Tool code</b> {rentalAgreement[0].tool_code}
            </p>
            <p>
              <b>Tool type</b> {tool[0].tool_type}
            </p>
            <p>
              <b>Tool brand</b> {tool[0].brand}
            </p>
            <p>
              <b>Checkout date</b>{" "}
              {dayjs(rentalAgreement[0].checkout_date).format("MM/DD/YY")}
            </p>
            <p>
              <b>Return date</b>{" "}
              {dayjs(rentalAgreement[0].return_date).format("MM/DD/YY")}
            </p>
            <p>
              <b>Daily rental charge</b> $
              {rentalAgreement[0].daily_rental_charge}
            </p>
            <p>
              <b>Chargeable days</b> {rentalAgreement[0].chargeable_days}
            </p>
            <p>
              <b>Pre-discount amount</b> $
              {rentalAgreement[0].pre_discount_amount}
            </p>
            <p>
              <b>Discount percent</b> {rentalAgreement[0].discount_percent}%
            </p>
            <p>
              <b>Discount amount</b> ${rentalAgreement[0].discount_amount}
            </p>
            <p>
              <b>Final amount</b> ${rentalAgreement[0].final_amount}
            </p>
          </div>
        )}
        {!rentalAgreement && (
          <div>
            <p>No Rental Agreement Found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
