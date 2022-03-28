import { Dispatch, FC, SetStateAction } from "react";
import { Box, Button } from "@mui/material";
import { CartProduct, ValidSizes } from "../../interfaces";

interface Props {
  selectedSize?: ValidSizes;
  sizes: ValidSizes[];
  setTempCartProduct: Dispatch<SetStateAction<CartProduct>>;
}

export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  setTempCartProduct,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() =>
            setTempCartProduct((prev) => ({
              ...prev,
              size,
            }))
          }
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
