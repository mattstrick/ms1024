"use server";

import { getRentalFeesFromDb, getToolsFromDb, submitForm } from "./utils";
import CheckoutForm from "./components/checkoutForm";
import dayjs, { Dayjs } from "dayjs";

export default async function Home() {
  const toolRows = await getToolsFromDb();
  const rentalFeeRows = await getRentalFeesFromDb();

  //   TABLES
  // MS1024_Tools
  // MS1024_Rental_Fees
  // MS1024_Rental_Transactions

  //   CREATE
  // ---------------
  //     await sql`CREATE TABLE MS1024_Tools (
  //     id INT PRIMARY KEY,
  //     Tool_Code VARCHAR(50),
  //     Tool_Type VARCHAR(100),
  //     Brand VARCHAR(100)
  // );`

  //   await sql `CREATE TABLE MS1024_Rental_Fees (
  //     Tool_Type VARCHAR(100),
  //     Daily_Charge DECIMAL(10, 2),
  //     Weekday_Charge BOOLEAN,
  //     Weekend_Charge BOOLEAN,
  //     Holiday_Charge BOOLEAN
  // );`

  //   await sql `CREATE TABLE MS1024_Rental_Transactions (
  //     Transaction_ID UUID PRIMARY KEY,
  //     Tool_Code VARCHAR(50),
  //     Checkout_Date DATE,
  //     Return_Date DATE,
  //     Daily_Rental_Charge DECIMAL(10, 2),
  //     Chargeable_Days INT,
  //     Pre_Discount_Amount DECIMAL(10, 2),
  //     Discount_Percent DECIMAL(5, 2),
  //     Discount_Amount DECIMAL(10, 2),
  //     Final_Amount DECIMAL(10, 2)
  // );`

  //   INSERT
  //  ------------------
  // await sql`INSERT INTO MS1024_Tools (id, Tool_Code, Tool_Type, Brand)
  // VALUES
  // (1, 'CHNS', 'Chainsaw', 'Stihl'),
  // (2, 'LADW', 'Ladder', 'Werner'),
  // (3, 'JAKD', 'Jackhammer', 'DeWalt'),
  // (4, 'JAKR', 'Jackhammer', 'Ridgid');`;

  //   await sql`INSERT INTO MS1024_Rental_Fees (Tool_Type, Daily_Charge, Weekday_Charge, Weekend_Charge, Holiday_Charge)
  //   VALUES
  //   ('Ladder', 1.99, TRUE, TRUE, FALSE),
  //   ('Chainsaw', 1.49, TRUE, FALSE, TRUE),
  // ('Jackhammer', 2.99, TRUE, FALSE, FALSE);`

  const handleFormSubmit = (toolSelect: string, checkoutDate: string, returnDate: string, discount: number) => {
    "use server";

    submitForm(toolSelect, dayjs(checkoutDate), dayjs(returnDate), discount, toolRows, rentalFeeRows);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">        
        <CheckoutForm tools={toolRows} handleSubmit={handleFormSubmit} />
      </main>
    </div>
  );
}
