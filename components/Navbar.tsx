"use client";

import Link from "next/link";
import Image from "next/image";
import {IconUserCircle} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="relative flex justify-between items-center px-4">
        <Link href="/" className="flex-shrink-0 text-2xl font-medium">
          <Image
            src={"/logo-light.png"}
            alt="logo"
            width={200}
            height={100}
          />
        </Link>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-xl">Search bar</h1>

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
  );
};

export default Navbar;
