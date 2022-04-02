import { FC } from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Props {
    title: number;
    subtitle: string;
    icon: JSX.Element;
}

export const SummaryTitle: FC<Props> = ({icon, subtitle, title}) => {
  return (
    <Card sx={{display: 'flex', alignItems: 'center'}}>
            <CardContent
              sx={{
                width: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
            </CardContent>
            <CardContent
              sx={{
                flex: "1 0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h3">{title}</Typography>
              <Typography variant="caption">{subtitle}</Typography>
            </CardContent>
          </Card>
  )
}
