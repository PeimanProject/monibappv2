"use client";

import React, { useEffect } from "react";
import { YearControl } from "@/app/component/persianDate/yearControl";
import _ from "lodash";
import { isEqual, format } from "date-fns-jalali";
import { DesktopInfoLecture } from "./desktopInfoLecture";
import { Container } from "@mui/material";
import { useNavBarStore } from "@/store/layout/useNavBarStore";
import { digitsEnToFa } from "@persian-tools/persian-tools";

export const DesktopCalendar = ({ list, year }) => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [lectures, setLecture] = React.useState(null);

  const { setNavBar } = useNavBarStore();

  useEffect(() => {
    setNavBar({
      title: `تقویم برگزاری جلسات ${digitsEnToFa(year)}`,
    });
  }, [setNavBar]);

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
      <DesktopInfoLecture
        show={show}
        hijri_month={list?.hijri_month}
        {...{ selectedDate, lectures, loading, onClose: () => setShow(false) }}
      />
      <Container>
        <YearControl
          list={list}
          onSelect={handleSelect}
          year={year}
          desktop={true}
        />
      </Container>
    </>
  );
};
