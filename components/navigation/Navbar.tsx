"use client";

import Link from "next/link";
import Image from "next/image";
import {IconUserCircle} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {ModeToggle} from "@/components/Theme";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 p-2 z-50">
      <div className="relative flex justify-between items-center px-2">
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

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/" className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:!w-8 [&_svg]:!h-8"
            >
              <IconUserCircle />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
