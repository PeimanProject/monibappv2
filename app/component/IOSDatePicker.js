import { Box } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import React, { useState, useRef, useEffect } from "react";

const IOSDatePicker = ({ initialDate, onChange }) => {
  const [date, setDate] = useState(initialDate || new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState([0, 0, 0, 0, 0]); // For year, month, day, hour, minute
  const itemHeight = 35; // Approximate height of each item in the wheel

  const dayRef = useRef(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };


  const days = Array.from(
    { length: getDaysInMonth(date.getFullYear(), date.getMonth()) },
    (_, i) => i + 1
  );
  

  useEffect(() => {
    const newDays = Array.from(
      { length: getDaysInMonth(date.getFullYear(), date.getMonth()) },
      (_, i) => i + 1
    );
    // Recalculate offsetY for days if the number of days in the month changes
    const currentDayIndex = newDays.indexOf(date.getDate());
    setOffsetY((prev) => {
      const newOffsetY = [...prev];
      newOffsetY[2] = -currentDayIndex * itemHeight;
      return newOffsetY;
    });
  }, [date.getFullYear(), date.getMonth(), itemHeight]);

  useEffect(() => {
    if (onChange) {
      onChange(date);
    }
  }, [date, onChange]);

  const handleTouchStart = (e, index) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e, index) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    setOffsetY((prev) => {
      const newOffsetY = [...prev];
      newOffsetY[index] = prev[index] + deltaY;
      return newOffsetY;
    });
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (index, values, unit) => {
    setIsDragging(false);
    const currentOffset = offsetY[index];
    const closestIndex = Math.round(currentOffset / -itemHeight);
    const newOffset = -closestIndex * itemHeight;

    setOffsetY((prev) => {
      const newOffsetY = [...prev];
      newOffsetY[index] = newOffset;
      return newOffsetY;
    });

    updateDate(index, values[closestIndex % values.length], unit);
  };

  const updateDate = (index, value, unit) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
     
      switch (unit) {
    
        case "day":
          newDate.setDate(parseInt(value, 10));
          break;      
        default:
          break;
      }
      return newDate;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "10px 0",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 70 /* Adjust as needed */,
          height: 150 /* Adjust as needed (visibleItems * itemHeight) */,
          overflow: "hidden",
        }}
      >
        <Box
          ref={dayRef}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1 / 1,
            transition: `transform 0.15s ease-out`,
            transform: `translateY(${offsetY[2]}px)`,
          }}
          onTouchStart={(e) => handleTouchStart(e, 2)}
          onTouchMove={(e) => handleTouchMove(e, 2)}
          onTouchEnd={() => handleTouchEnd(2, days, "day")}
        >
          {days.map((day) => (
            <Box
              key={day}
              sx={{
                height: 35,
                lineHeight: 35,
                textAlign: "center",
                fontSize: "1.2em",
                color: "#333",
                whiteSpace: "nowrap",
              }}
            >
              {digitsEnToFa(day)}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: 1 / 1,
            height: 35,            
            border: 0,
            borderColor:"divider",
            borderRadius:5,
            boxSizing: "border-box",
            pointerEvents: "none",
            bgcolor:"#bccac4",
            zIndex:-1
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default IOSDatePicker;
