"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold">My App</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/">Home</Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/about">About</Link>
        </NavbarItem>

        <NavbarItem>
          <Button as={Link} color="primary" href="/login">
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
