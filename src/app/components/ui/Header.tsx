"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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
import LogoutConfirmModal from "../modals/LogoutConfirmModal";

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();

  const isAuth = status === "authenticated";
  const shouldShowAuthPlaceholders = status === "loading";

  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const visibleNavItems = siteConfig.navItems.filter(
    (item) => !item.requiresAuth || isAuth,
  );

  const handleConfirmSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setIsMenuOpen(false);
  };

  return (
    <>
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="h-[80px] border-b border-brand-gold bg-brand-deep font-sans"
        classNames={{
          wrapper:
            "w-full px-3 xxs:px-4 xs:px-6 md:px-8 lg:px-8 xl:px-12 xxl:px-16",
          menu: "bg-brand-deep text-brand-cream",
        }}
      >
        <NavbarBrand>
          <div className="flex shrink-0 items-center gap-2 xs:gap-3">
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
                  h-[44px] w-[44px] shrink-0 rounded-full object-cover
                  xs:h-[52px] xs:w-[52px]
                  md:h-[58px] md:w-[58px]
                  lg:h-[48px] lg:w-[48px]
                  xl:h-[56px] xl:w-[56px]
                  xxl:h-[62px] xxl:w-[62px]
                "
              />
            </Link>

            <p
              className="
                whitespace-nowrap font-bold text-brand-cream
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
          {shouldShowAuthPlaceholders && (
            <>
              <NavbarItem>
                <div className="h-5 w-[120px] animate-pulse rounded bg-brand-gold/30" />
              </NavbarItem>
              <NavbarItem>
                <div className="h-9 w-24 animate-pulse rounded bg-brand-gold/30" />
              </NavbarItem>
            </>
          )}

          {!shouldShowAuthPlaceholders && isAuth && (
            <NavbarItem>
              <div
                className="
                  h-9 w-9 bg-brand-gold text-brand-deep
                  transition-all duration-300 hover:scale-105
                  hover:bg-brand-primary hover:text-brand-cream
                "
              >
                <Image
                  src="/auth-unlock.svg"
                  alt="Authenticated"
                  width={24}
                  height={24}
                  className="text-brand-cream"
                />
              </div>
            </NavbarItem>
          )}

          {!shouldShowAuthPlaceholders && !isAuth && (
            <NavbarItem>
              <Button
                isIconOnly
                aria-label="Auth"
                onPress={() => setAuthMode("login")}
                className="
                  h-9 w-9 bg-brand-gold text-brand-deep
                  transition-all duration-300 hover:scale-105
                  hover:bg-brand-primary hover:text-brand-cream
                "
              >
                <Image src="/auth.svg" alt="Auth" width={20} height={20} />
              </Button>
            </NavbarItem>
          )}

          {!shouldShowAuthPlaceholders && isAuth && (
            <NavbarItem>
              <Button
                onPress={() => setLogoutConfirmOpen(true)}
                className="bg-brand-gold text-brand-deep hover:bg-brand-primary hover:text-brand-cream"
              >
                Logout
              </Button>
            </NavbarItem>
          )}

          <NavbarMenuToggle className="text-brand-cream" />
        </NavbarContent>

        <NavbarContent
          justify="end"
          className="hidden gap-1 md:flex lg:gap-1 xl:gap-2 xxl:gap-3"
        >
          {visibleNavItems.map((item) => {
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

          {shouldShowAuthPlaceholders && (
            <>
              <NavbarItem className="lg:hidden">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-[120px] animate-pulse rounded bg-brand-gold/30" />
                  <div className="h-9 w-28 animate-pulse rounded bg-brand-gold/30" />
                </div>
              </NavbarItem>
              <NavbarItem className="hidden lg:flex gap-2">
                <div className="h-5 w-[220px] animate-pulse rounded bg-brand-gold/30" />
                <div className="h-9 w-28 animate-pulse rounded bg-brand-gold/30" />
              </NavbarItem>
            </>
          )}

          {!shouldShowAuthPlaceholders && !isAuth && (
            <>
              <NavbarItem className="lg:hidden">
                <Button
                  isIconOnly
                  aria-label="Auth"
                  onPress={() => setAuthMode("login")}
                  className="
                    bg-brand-gold text-brand-deep
                    transition-all duration-300 hover:scale-105
                    hover:bg-brand-primary hover:text-brand-cream
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
                    lg:h-9 lg:px-3 lg:text-xs
                    xl:h-10 xl:px-4 xl:text-sm
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
                    lg:h-9 lg:px-3 lg:text-xs
                    xl:h-10 xl:px-4 xl:text-sm
                  "
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}

          {!shouldShowAuthPlaceholders && isAuth && (
            <>
              <NavbarItem>
                <div
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    bg-brand-gold text-brand-deep
                    transition-all duration-300 hover:scale-105
                    hover:bg-brand-primary hover:text-brand-cream
                    md:h-9 md:w-9
                  "
                >
                  <Image
                    src="/auth-unlock.svg"
                    alt="Authenticated"
                    width={24}
                    height={24}
                    className="text-brand-cream"
                  />
                </div>
              </NavbarItem>

              <NavbarItem>
                <Button
                  onPress={() => setLogoutConfirmOpen(true)}
                  className="bg-brand-gold text-brand-deep hover:bg-brand-primary hover:text-brand-cream"
                >
                  Logout
                </Button>
              </NavbarItem>
            </>
          )}
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
          {visibleNavItems.map((item) => {
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
            {shouldShowAuthPlaceholders && (
              <div className="flex flex-col gap-3">
                <div className="h-5 w-40 animate-pulse rounded bg-brand-gold/30" />
                <div className="h-9 w-28 animate-pulse rounded bg-brand-gold/30" />
              </div>
            )}

            {!shouldShowAuthPlaceholders && !isAuth && (
              <>
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
              </>
            )}

            {!shouldShowAuthPlaceholders && isAuth && (
              <>
                <div className="flex items-center gap-2 px-1">
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center rounded-full
                      bg-brand-gold text-brand-deep
                      transition-all duration-300 hover:scale-105
                      hover:bg-brand-primary hover:text-brand-cream
                    "
                  >
                    <Image
                      src="/auth-unlock.svg"
                      alt="Authenticated"
                      width={24}
                      height={24}
                      className="text-brand-cream"
                    />
                  </div>
                </div>

                <Button
                  onPress={() => setLogoutConfirmOpen(true)}
                  className="bg-brand-gold text-brand-deep hover:bg-brand-primary hover:text-brand-cream"
                >
                  Logout
                </Button>
              </>
            )}
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

      <LogoutConfirmModal
        isOpen={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
