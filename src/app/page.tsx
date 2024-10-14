"use server";

import TextField from "@mui/material/TextField";
import { getRentalFeesFromDb, getToolsFromDb } from "./utils";
import InputAdornment from "@mui/material/InputAdornment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckoutForm from "./components/checkoutForm";

export default async function Home() {
  const toolRows = await getToolsFromDb();
  const rentalFeeRows = await getRentalFeesFromDb();

  //   TABLES
  // MS1024_Tools
  // MS1024_Rental_Fees

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h2>Tools</h2>
          {toolRows.map((row) => (
            <div key={row.id}>
              {row.id} - {row.tool_code} - {row.tool_type} - {row.brand}
            </div>
          ))}
        </div>
        <div>
          <h2>Rental Fees</h2>
          {rentalFeeRows.map((row) => (
            <div key={row.id}>
              {row.tool_type} - ${row.daily_charge} -{" "}
              {row.weekday_charge ? "Yes" : "No"} -{" "}
              {row.weekend_charge ? "Yes" : "No"} -{" "}
              {row.holiday_charge ? "Yes" : "No"}
            </div>
          ))}
        </div>

        <CheckoutForm />
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        footer
      </footer> */}
    </div>
  );
}
