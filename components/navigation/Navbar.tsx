import Link from "next/link";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import { auth } from "@/auth";
import {Button} from "@/components/ui/button";
import {IconUserCircle} from "@tabler/icons-react";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between fixed z-50 w-full gap-5 px-6 py-3 sm:px-12 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.08]">
      <Link href="/" className="flex flex-row items-center text-2xl font-semibold">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={36}
          height={36}
          quality={100}
        />
        <h1 className="primary-text-gradient ml-1">OpenLyst</h1>
      </Link>

      <div className="flex-between gap-4">
        {session?.user?.id ? (
					<UserAvatar
						id={session.user.id}
						name={session.user.name!}
						imageUrl={session.user?.image}
					/>
				) : (
          <Link href="/" className="flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:!w-8 [&_svg]:!h-8"
            >
              <IconUserCircle />
            </Button>
          </Link>
        )}

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
