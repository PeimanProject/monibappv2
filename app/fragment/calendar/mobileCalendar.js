"use client";

import React from "react";
import { YearControl } from "@/app/component/persianDate/yearControl";
import { useTranslations } from "next-intl";
import _ from "lodash";
import { isEqual, format } from "date-fns-jalali";
import { InfoLecture } from "./infoLecture";

export const MobileCalendar = ({ list, year, desktop }) => {
  const t = useTranslations("Lecture");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [lectures, setLecture] = React.useState(null);

  const handleSelect = React.useCallback(
    (date) => async () => {
      setSelectedDate(date);
      const items = _.map(
        _.filter(list?.lecture, (v) =>
          isEqual(
            format(v.date, "yyyy-MM-dd"),
            format(date?.currentDate, "yyyy-MM-dd")
          )
        ),
        ({ id }) => ({ id })
      );

      if (!!items && !_.isEmpty(items)) {
        setShow(true);
        setLoading(true);
        setLecture(null);
        const req = await fetch("/api/lecture/ids", {
          method: "POST",
          body: JSON.stringify({ list: items }),
        });
        const lecture = await req.json();
        setLecture(lecture);
        setLoading(false);
      }
    },
    []
  );

  return (
    <>
      {!desktop && (
        <InfoLecture
          show={show}
          hijri_month={list?.hijri_month}
          {...{
            selectedDate,
            lectures,
            loading,
            onClose: () => setShow(false),
          }}
        />
      )}
      <YearControl list={list} onSelect={handleSelect} year={year} />
    </>
  );
};
