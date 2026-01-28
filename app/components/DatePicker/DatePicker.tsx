"use client";
import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  selectedDate: Date | null;
  handleChange: (date: Date | null) => void;
  setIsDatePickerOpen: (value: boolean) => void;
}

export const DatePickerComponent: FC<Props> = ({ selectedDate, handleChange, setIsDatePickerOpen }) => {
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => handleChange(date)}
        onCalendarOpen={() => setIsDatePickerOpen(true)}
        onCalendarClose={() => setIsDatePickerOpen(false)}
        dateFormat="yyyy-MM-dd"
        className="px-2 border rounded text-sm text-gray-400   z-50"
        popperPlacement="bottom-start"
        popperClassName="z-[9999]"
        portalId="datepicker-portal"
      />
    </div>

  );
};
export default DatePickerComponent; 