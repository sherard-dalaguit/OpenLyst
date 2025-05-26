"use client";

import Link from "next/link";
import Image from "next/image";
import {IconUserCircle} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 z-50">
      <Link href="/" className="text-2xl font-medium">
        <Image
          src={"/logo-light.png"}
          alt="logo"
          width={200}
          height={100}
        />
      </Link>

      <h1 className="text-2xl">Search bar</h1>

      <Link href="/">
        <Button
          variant="ghost"
          size="icon"
          className="[&_svg]:!w-6 [&_svg]:!h-6"
        >
          <IconUserCircle />
        </Button>
      </Link>
    </div>
  );
};

export default Navbar;
