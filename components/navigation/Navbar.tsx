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
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex flex-row items-center text-2xl font-semibold">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={48}
          height={48}
        />
        <h1 className="primary-text-gradient">Remote Radar</h1>
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
