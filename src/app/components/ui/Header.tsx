"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";

import { siteConfig } from "../../config/site.config";
import AuthModal from "../modals/AuthModal";

export default function Header() {
  const pathname = usePathname();

  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="border-b border-brand-gold bg-brand-deep h-[80px] font-sans"
        classNames={{
          wrapper:
            "w-full px-3 xxs:px-4 xs:px-6 md:px-8 lg:px-8 xl:px-12 xxl:px-16",
          menu: "bg-brand-deep text-brand-cream",
        }}
      >
        <NavbarBrand>
          <div className="flex items-center gap-2 xs:gap-3 shrink-0">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="shrink-0"
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={62}
                height={62}
                priority
                className="
          shrink-0 rounded-full object-cover
          w-[44px] h-[44px]
          xs:w-[52px] xs:h-[52px]
          md:w-[58px] md:h-[58px]
          lg:w-[48px] lg:h-[48px]
          xl:w-[56px] xl:h-[56px]
          xxl:w-[62px] xxl:h-[62px]
        "
              />
            </Link>

            <p
              className="
        font-bold text-brand-cream whitespace-nowrap
        text-lg xs:text-xl
        md:text-2xl
        lg:text-lg xl:text-xl xxl:text-2xl
      "
            >
              Recipe & Kitchen
            </p>
          </div>
        </NavbarBrand>
        <NavbarContent justify="end" className="md:hidden">
          <NavbarMenuToggle className="text-brand-cream" />
        </NavbarContent>

        <NavbarContent
          justify="end"
          className="hidden md:flex gap-1 lg:gap-1 xl:gap-2 xxl:gap-3"
        >
          {siteConfig.navItems.map((item) => {
            const isActive = item.href === pathname;

            return (
              <NavbarItem key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    inline-flex items-center rounded-full
                    transition-all duration-300 ease-in-out hover:scale-105
                    md:px-3 md:py-2 md:text-xs
                    lg:px-3 lg:py-2 lg:text-xs
                    xl:px-4 xl:py-2 xl:text-sm
                    ${
                      isActive
                        ? "bg-brand-primary text-brand-cream shadow-sm"
                        : "text-brand-cream hover:bg-brand-gold hover:text-brand-deep"
                    }
                  `}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            );
          })}

          <NavbarItem className="lg:hidden">
            <Button
              isIconOnly
              aria-label="Auth"
              onPress={() => setAuthMode("login")}
              className="
                bg-brand-gold text-brand-deep
                hover:bg-brand-primary hover:text-brand-cream
                transition-all duration-300 hover:scale-105
                md:h-9 md:w-9
              "
            >
              <Image src="/auth.svg" alt="Auth" width={20} height={20} />
            </Button>
          </NavbarItem>

          <NavbarItem className="hidden lg:flex">
            <Button
              onPress={() => setAuthMode("login")}
              className="
                bg-brand-gold text-brand-deep transition-all duration-300 hover:scale-105
                hover:bg-brand-primary hover:text-brand-cream
                lg:text-xs lg:px-3 lg:h-9
                xl:text-sm xl:px-4 xl:h-10
              "
            >
              Login
            </Button>
          </NavbarItem>

          <NavbarItem className="hidden lg:flex">
            <Button
              onPress={() => setAuthMode("signup")}
              className="
                bg-brand-gold text-brand-deep transition-all duration-300 hover:scale-105
                hover:bg-brand-primary hover:text-brand-cream
                lg:text-xs lg:px-3 lg:h-9
                xl:text-sm xl:px-4 xl:h-10
              "
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu
          className="pt-6"
          motionProps={{
            initial: { opacity: 0, y: -8 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.18, ease: "easeOut" },
            },
            exit: {
              opacity: 0,
              y: -8,
              transition: { duration: 0.12, ease: "easeIn" },
            },
          }}
        >
          {siteConfig.navItems.map((item) => {
            const isActive = item.href === pathname;

            return (
              <NavbarMenuItem key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full rounded-xl px-4 py-3 text-base transition-colors ${
                    isActive
                      ? "bg-brand-primary text-brand-cream"
                      : "text-brand-cream hover:bg-brand-gold hover:text-brand-deep"
                  }`}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}

          <div className="mt-4 grid gap-3 px-2">
            <Button
              onPress={() => {
                setAuthMode("login");
                setIsMenuOpen(false);
              }}
              className="bg-brand-gold text-brand-deep hover:bg-brand-primary hover:text-brand-cream"
            >
              Login
            </Button>

            <Button
              onPress={() => {
                setAuthMode("signup");
                setIsMenuOpen(false);
              }}
              className="bg-brand-gold text-brand-deep hover:bg-brand-primary hover:text-brand-cream"
            >
              Sign Up
            </Button>
          </div>
        </NavbarMenu>
      </Navbar>

      <AuthModal
        mode={authMode}
        isOpen={authMode !== null}
        onOpenChange={(open) => {
          if (!open) setAuthMode(null);
        }}
        onModeChange={(nextMode) => setAuthMode(nextMode)}
      />
    </>
  );
}
