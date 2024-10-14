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

export default function CheckoutForm() {
  return (
    <div>
      <h1>Checkout</h1>
      <FormControl fullWidth className="mb-4">
        <InputLabel id="demo-simple-select-label">Tool</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Tool"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className="mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Checkout Date" />
        </LocalizationProvider>
      </FormControl>
      <FormControl fullWidth className="mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Return Date" />
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
        />
      </FormControl>
    </div>
  );
}
