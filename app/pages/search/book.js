"use client";
import { Box, ButtonBase, Container, Typography, Divider } from "@mui/material";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { cleanText } from "../miskat/mobileMiskat";
import Link from "next/link";

export const Book = ({ resultBook }) => {

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 5, color: "text.primary", width: 1 / 1 }}>
        {!!resultBook &&
          resultBook?.result?.result?.map((book, index) => (
            <Link
              key={index}
              href={`/miskat/id?id=${book.id}&page_id=${book.page_id}&title=${book.bookInfo?.title}`}
            >
              <ButtonBase
                sx={{
                  mb: 2,
                  borderBottom: 1,
                  borderColor: "primary.main",
                  py: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: 1 / 1,
                  boxSizing: "border-box",
                  px: 2,
                  color: "text.primary",
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    width: 1 / 1,
                    boxSizing: "border-box",
                  }}
                >
                  <Typography fontWeight="bold" variant="body1">
                    {book.bookInfo?.title}
                  </Typography>
                  <Typography variant="caption">
                    صفحه: {digitsEnToFa(book.page_id)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    em: { color: "secondary.dark", fontWeight: "bold" },
                    textAlign: "justify",
                  }}
                >
                  {book.highlight?.text && (
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "justify" }}
                      dangerouslySetInnerHTML={{
                        __html: cleanText(`${book.highlight?.text}`),
                      }}
                    />
                  )}
                  {book.highlight?.footnote && (
                    <>
                      <Divider
                        sx={{
                          mt: 2,
                          width: "100%",
                          "&:after": { borderTopColor: "primary.main" },
                          "&:before": { borderTopColor: "primary.main" },
                        }}
                      >
                        <Typography variant="caption">پانویس</Typography>
                      </Divider>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "justify",
                          p: 1,
                          bgcolor: "grey.100",
                          borderRadius: 5,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: cleanText(`${book.highlight?.footnote}`),
                        }}
                      />
                    </>
                  )}
                </Box>
              </ButtonBase>
            </Link>
          ))}
      </Box>
    </Container>
  );
};
