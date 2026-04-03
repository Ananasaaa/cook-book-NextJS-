export type NavItem = {
  href: string;
  label: string;
  requiresAuth?: boolean;
};

export const siteConfig = {
  navItems: [
    { href: "/", label: "Home" },
    { href: "/recipes", label: "All recipes" },
    { href: "/ingredients", label: "Ingredients" },
    {
      href: "/saved",
      label: "Box recipes",
      requiresAuth: true,
    },
  ] satisfies NavItem[],
};
