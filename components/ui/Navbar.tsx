import { AppBar, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"

export const Navbar = () => {
  return (
    <AppBar>
        <Toolbar>
            <NextLink href="/" passHref>
                <Link display="flex" alignItems="center">
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ml: 0.5}}>Shop</Typography>
                </Link>
            </NextLink>
        </Toolbar>
    </AppBar>
  )
}
