import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"

interface Props {
  quantity: number;
  addOne: () => void;
  removeOne: () => void;
}

export const ItemCounter: FC<Props> = ({ addOne, quantity, removeOne}) => {
  return (
    <Box display="flex" alignItems="center">
        <IconButton onClick={removeOne}>
            <RemoveCircleOutline/>
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center'}}> {quantity} </Typography>
        <IconButton onClick={addOne}>
            <AddCircleOutline/>
        </IconButton>

    </Box>
  )
}
