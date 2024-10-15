import { sql } from "@vercel/postgres";
import dayjs, { Dayjs } from "dayjs";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export async function getToolsFromDb() {
  const { rows } = await sql`SELECT * from MS1024_Tools`;

  return rows;
}

export async function getRentalFeesFromDb() {
  const { rows } = await sql`SELECT * from MS1024_Rental_Fees`;

  return rows;
}

export async function getRentalAgreementFromDb(uuid: string) {
  const { rows } =
    await sql`SELECT * from MS1024_Rental_Transactions WHERE Transaction_ID = ${uuid} LIMIT 1`;

  return rows;
}

export async function submitRentalAgreement(values: {
  uuid: any;
  tool_code: any;
  checkout_date: any;
  return_date: any;
  daily_rental_charge: any;
  chargeable_days: any;
  pre_discount_amount: any;
  discount_percent: any;
  discount_amount: any;
  final_amount: any;
}) {
    
  await sql`INSERT INTO MS1024_Rental_Transactions (
    Transaction_ID,
    Tool_Code,
    Checkout_Date,
    Return_Date,
    Daily_Rental_Charge,
    Chargeable_Days,
    Pre_Discount_Amount,
    Discount_Percent,
    Discount_Amount,
    Final_Amount
)
VALUES (
    ${values.uuid},
    ${values.tool_code},
    ${values.checkout_date},
    ${values.return_date},
    ${values.daily_rental_charge},
    ${values.chargeable_days},
    ${values.pre_discount_amount},
    ${values.discount_percent},
    ${values.discount_amount},
    ${values.final_amount}
);`;
}

export const submitForm = (
  toolSelect: string,
  checkoutDate: Dayjs,
  returnDate: Dayjs,
  discount: number,
  tools: any[],
  rentalFees: any[]
) => {
  const uuid = uuidv4();
  const toolType = getToolTypeFromToolCode(toolSelect, tools);
  const rentalFee = getRentalFeesFromToolType(toolType, rentalFees);
  const chargeableDays = getChargeableDays(checkoutDate, returnDate, rentalFee);
  const preDiscountAmount = chargeableDays * rentalFee.daily_charge;
  const discountAmount = preDiscountAmount * ((1 / 100) * discount);

  const values = {
    uuid: uuid,
    tool_code: toolSelect,
    checkout_date: checkoutDate.format("MM/DD/YYYY"),
    return_date: returnDate.format("MM/DD/YYYY"),
    daily_rental_charge: parseFloat(rentalFee.daily_charge),
    chargeable_days: chargeableDays,
    pre_discount_amount: preDiscountAmount,
    discount_percent: discount,
    discount_amount: discountAmount,
    final_amount: preDiscountAmount - discountAmount,
  };

  console.log(values);
  submitRentalAgreement(values);

  redirect(`/confirmation/${uuid}`);
};

const getToolTypeFromToolCode = (toolCode: string, tools: any[]) => {
  const tool = tools.filter((tool) => {
    return tool.tool_code === toolCode;
  });

  return tool[0].tool_type;
};

const getRentalFeesFromToolType = (toolType: string, rentalFees: any[]) => {
  const rentalFee = rentalFees.filter((rentalFee) => {
    return rentalFee.tool_type === toolType;
  });

  return rentalFee[0];
};

const getChargeableDays = (start: Dayjs, end: Dayjs, fees: any) => {
  let chargeableDays = 0;

  const rentedDates = getDatesBetweenStartAndEnd(start, end);

  rentedDates.map((rentedDate: any) => {
    if (isDateChargeable(dayjs(rentedDate), fees)) {
      chargeableDays += 1;
    }
  });

  return chargeableDays;
};


const getDatesBetweenStartAndEnd = (start: Dayjs, end: Dayjs) => {
    const dateArray = [];
    let currentDate = dayjs(start);
    const stopDate = dayjs(end);
   
    while (currentDate.isBefore(stopDate)) {
        console.log('CURRENT DATE', currentDate);
        dateArray.push( dayjs(currentDate).format('DD/MM/YYYY') )
        currentDate = dayjs(currentDate).add(1, 'days');
    }

    return dateArray;
  }

  const isDateChargeable = (date: Dayjs, fees: { holiday_charge: any; weekday_charge: any; weekend_charge: any; }) => {
    const dayOfWeek = date.day();

    if (fees.holiday_charge && isDateHoliday(date)) {
        return true;
    } else if (fees.weekday_charge && (dayOfWeek >= 1 && dayOfWeek <=5)) {
        return true;
    } else if (fees.weekend_charge && (dayOfWeek === 0 || dayOfWeek === 6)) {
        return true;
    }

    return false;
  }

  const isDateHoliday = (date: Dayjs) => {
    if (getFirstMondayInSeptember(date.get('year'))) {
        return true;
    } else if (date.isSame(getObservedIndependenceDay(date.get('year')))) {
        return true;
    } else {
        return false;
    }
  }

  // 4th of July
  const getObservedIndependenceDay = (year: number) => {
    // Get July 4th for the given year
    let july4th = dayjs(`${year}-07-04`);
    
    // Check which day of the week it falls on
    const dayOfWeek = july4th.day();
    
    if (dayOfWeek === 0) {
      // If it's Sunday, observe on Monday (add 1 day)
      return july4th.add(1, 'day');
    } else if (dayOfWeek === 6) {
      // If it's Saturday, observe on Friday (subtract 1 day)
      return july4th.subtract(1, 'day');
    } else {
      // Otherwise, observe on the actual day
      return july4th;
    }
  }

  // Labor Day
  const getFirstMondayInSeptember = (year: number) => {
    // Start with September 1st of the given year
    let date = dayjs(`${year}-09-01`);
    
    // Find the first Monday
    while (date.day() !== 1) { // 0 is Sunday, 1 is Monday, etc.
      date = date.add(1, 'day');
    }
    
    return date;
  }
