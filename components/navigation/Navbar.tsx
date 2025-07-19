"use client";

import Link from "next/link";
import Image from "next/image";
import {IconUserCircle} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import MobileNavigation from "@/components/navigation/MobileNavigation";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-3 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex flex-row items-center text-2xl font-semibold">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={48}
          height={48}
        />
        <h1 className="primary-text-gradient">Remote Radar</h1>
      </Link>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-xl">Search bar</h1>

      <div className="flex-between gap-4">
        <Link href="/" className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="[&_svg]:!w-8 [&_svg]:!h-8"
          >
            <IconUserCircle />
          </Button>
        </Link>

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
