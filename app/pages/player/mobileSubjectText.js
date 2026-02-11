"use client";

import { Box } from "@mui/material";
import React from "react";
import { SubjectList } from "@/app/fragment/subjectList/subjectList";
import _ from "lodash";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import { TextList } from "@/app/component/quran/textList";
import { useTranslate } from "@/core/useTranslation";
import { useConnectivity } from "@/core/ConnectivityProvider";

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
  metadata,
  quranData,
  contextId,
  tags,
  position = "lecture",
}) => {
  const [value, setValue] = React.useState("subject");
  const [index, setIndex] = React.useState(0);
  const { get } = useTranslate()
  const { isConnected } = useConnectivity()

  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

  React.useEffect(() => {
    // ۱. چک کردن امن تمام مقادیر با Optional Chaining
    const isTitlesEmpty = _.isEmpty(titles);
    const isTagsEmpty = _.isEmpty(tags);
    const isLastTopicEmpty = _.isEmpty(lastTopic);
    const isJsonSubjectEmpty = _.isEmpty(metadata?.json_subject); // استفاده از ?.

    // ۲. اگر همه لیست‌ها خالی بودند، برو روی تب قرآن
    if (isTitlesEmpty && isTagsEmpty && isLastTopicEmpty && isJsonSubjectEmpty) {
      setValue("quran");
      setIndex(1);
    }
  }, [titles, tags, lastTopic, metadata]);
  const hasTitles = !_.isEmpty(titles);
  const hasTags = !_.isEmpty(tags);
  const hasLastTopic = !_.isEmpty(lastTopic);
  // ۲. برای json_subject اول وجود metadata و بعد خالی نبودن فیلد را چک می‌کنیم
  const hasJsonSubject = metadata?.json_subject && !_.isEmpty(metadata.json_subject);
  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
      }}
    >
      {(hasTitles || hasTags || hasLastTopic || hasJsonSubject) && mainId === 1 && (
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
              disabled={!isConnected}
              onChange={handleChange}
              value={"quran"}
              index={1}
              selected={value === "quran"}
              text={get("Lecture.quran")}
            />
          </TabStyle>
        </Box>
      )
      }
      <Box sx={{ pt: 1, pb: 22 }}>
        {value === "subject" && (
          <Box sx={{ px: 2 }}>
            <SubjectList
              list={
                !_.isEmpty(tags) ? tags :
                  !_.isEmpty(titles) ? titles :
                    !_.isEmpty(lastTopic) ? lastTopic :
                      (metadata?.json_subject || []) // استفاده از Optional Chaining و مقدار پیش‌فرض
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
