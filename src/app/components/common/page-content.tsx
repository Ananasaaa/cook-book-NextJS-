"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "../../config/site.config";

const pageContent = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = usePathname();
  const pageContent =
    siteConfig.pagesContent[pathname as keyof typeof siteConfig.pagesContent];

  if (!pageContent) {
    return <div>Page not found</div>;
  }

  return <p>{pageContent.content}</p>;
};

export default pageContent;
