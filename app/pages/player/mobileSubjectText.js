"use client";

import { Box } from "@mui/material";
import React from "react";
import { SubjectList } from "@/app/fragment/subjectList/subjectList";
import _ from "lodash";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import { TextList } from "@/app/component/quran/textList";
import { useTranslate } from "@/core/useTranslation";

export const MobileSubjectText = ({
  titles,
  onTitleClick,
  title,
  lectureId,
  seriesId,
  type,
  verse,
  mainId,
  lastTopic,
  quranData,
  contextId,
  tags,
  position = "lecture",
}) => {
  const [value, setValue] = React.useState("subject");
  const [index, setIndex] = React.useState(0);
  const { get } = useTranslate()


  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

  React.useEffect(() => {
    if (!!_.isEmpty(titles) && !!_.isEmpty(tags) && !!_.isEmpty(lastTopic)) {
      setValue("quran");
      setIndex(1);
    }
  }, [titles, lastTopic]);

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      {(!_.isEmpty(titles) || !_.isEmpty(tags) || !_.isEmpty(lastTopic)) &&
        mainId === 1 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TabStyle index={index}>
              <TabNormalItem
                onChange={handleChange}
                value={"subject"}
                index={0}
                selected={value === "subject"}
                text={get("Lecture.subject")}
              />
              <TabNormalItem
                onChange={handleChange}
                value={"quran"}
                index={1}
                selected={value === "quran"}
                text={get("Lecture.quran")}
              />
            </TabStyle>
          </Box>
        )}
      <Box sx={{ pt: 1, pb: 22 }}>
        {value === "subject" && (
          <Box sx={{ px: 2 }}>
            <SubjectList
              list={
                !_.isEmpty(tags) ? tags : _.isEmpty(titles) ? lastTopic : titles
              }
              {...{
                onTitleClick,
                title,
                lectureId,
                seriesId,
                type,
                verse,
                mainId,
              }}
            />
          </Box>
        )}
        {value === "quran" && mainId === 1 && (
          <>
            <TextList
              data={quranData}
              seriesId={seriesId}
              rId={contextId}
              position={position}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
