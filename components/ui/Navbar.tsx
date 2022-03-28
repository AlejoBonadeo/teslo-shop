import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";
import { CartContext, UiContext } from "../../context";

export const Navbar = () => {
  const router = useRouter();
  const { toggleMenu, isMenuOpen } = useContext(UiContext);
  const { cart } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const quantity = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart])

  const search = () => {
    if (!searchTerm.trim().length) return;
    navigateTo(`/search/${searchTerm}`);
  };

  const navigateTo = (url: string) => {
    setIsSearchVisible(false)
    router.push(url);
  };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        <Box
          sx={{
            display: isSearchVisible ? 'none' : {
              xs: "none",
              sm: "block",
            },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button
                color={router.asPath === "/category/men" ? "primary" : "info"}
              >
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button
                color={router.asPath === "/category/women" ? "primary" : "info"}
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref>
            <Link>
              <Button
                color={router.asPath === "/category/kid" ? "primary" : "info"}
              >
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} />
        <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          onClick={toggleMenu}
        >
          <SearchOutlined />
        </IconButton>

        {isSearchVisible && !isMenuOpen ? (
          <Input
            className="fadeIn"
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") search();
            }}
            autoFocus
            sx={{display:{xs: 'none', sm: 'flex'}}}
          />
        ) : (
          <IconButton onClick={() => setIsSearchVisible(true)} className="fadeIn" sx={{display:{xs: 'none', sm: 'block'}}}>
            <SearchOutlined />
          </IconButton>
        )}
        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={quantity > 9 ? '+9' : quantity} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={toggleMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
