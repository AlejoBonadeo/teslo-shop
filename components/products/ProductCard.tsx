import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Link,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import { Product } from "../../interfaces";

interface Props extends Product {}

export const ProductCard: FC<Props> = ({ images, title, price, slug, inStock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsImageLoaded(true), 1000)
    return () => clearTimeout(timeout)
  }, [])
  

  const productImage = useMemo(() => {
    return isHovered ? images[1]: images[0];
  }, [isHovered, images]);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={`/products/${slug}`} prefetch={false} passHref>
          <Link>
            <CardActionArea>
              <>
                {!!inStock ||
                  <Chip
                    color="primary"
                    label="No hay disponibles"
                    sx={{ position: 'absolute', zIndex: 1, top: 10, left: 10}}
                  />
                }
                <CardMedia
                  component="img"
                  image={productImage}
                  alt={title}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </>
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{title}</Typography>
        <Typography fontWeight={500}>${price}</Typography>
      </Box>
    </Grid>
  );
};
