"use client";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import React from "react";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import { QueryResultRow } from "@vercel/postgres";

export default function CheckoutForm({tools, handleSubmit} : { tools: QueryResultRow[], handleSubmit: (toolSelect: string, checkoutDate: string, returnDate: string, discount: number) => void }) {
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [toolSelect, setToolSelect] = React.useState<string>(tools[0].tool_code);
  const [checkoutDate, setCheckoutDate] = React.useState(dayjs(new Date()));
  const [returnDate, setReturnDate] = React.useState(dayjs(new Date()).add(1, 'd'));
  const [discount, setDiscount] = React.useState<number>(0);

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!checkoutDate.isBefore(returnDate)) {
        setErrorMsg("Checkout date must be before return date.");
    } else if (discount > 100 || discount < 0) {
        setErrorMsg("Discount must be a number between 0 and 100");
    } else {
        setErrorMsg("");
        handleSubmit(toolSelect, checkoutDate.toString(), returnDate.toString(), discount);        
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleFormSubmit}>
        <FormControl fullWidth className="mb-4">
          <InputLabel id="demo-simple-select-label">Tool</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Tool"
            onChange={(e) => {
              setToolSelect(e.target.value);
            }}
            value={toolSelect}
          >
            {tools.map((tool) => (
              <MenuItem key={tool.id} value={tool.tool_code}>
                {tool.brand} {tool.tool_type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={(e) => {
                setCheckoutDate(dayjs(e));
              }}
              value={checkoutDate}
              label="Checkout Date"
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker onChange={(e) => {
                setReturnDate(dayjs(e));
              }}
              value={returnDate} label="Return Date" />
          </LocalizationProvider>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <TextField
            label="Discount"
            id="outlined-start-adornment"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              },
            }}
            type="number"
            onChange={(e) => {
                setDiscount(parseInt(e.target.value));
            }}
            value={discount}
          />
        </FormControl>
        <div className="text-pink-600">{errorMsg}</div>
        <div>
          <Button type="submit">Generate Rental Agreement</Button>
        </div>
      </form>
    </div>
  );
}
