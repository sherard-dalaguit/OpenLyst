import LitButton from '@/components/ui/LitButton';
import { IconBriefcase, IconArrowDown } from '@tabler/icons-react';
import {Spotlight} from "@/components/ui/spotlight";
import Image from 'next/image';
import {ContainerScroll} from '@/components/ui/container-scroll-animation';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto mt-[32vh] w-screen">
      <Spotlight />

      <div className="w-full absolute left-0 top-0 min-h-96 pointer-events-none rotate-180">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          width={1000}
          height={1000}
          className="w-full h-full opacity-70 filter invert dark:filter-none"
        />
      </div>

      <h1 className="text-8xl font-semibold">
        Turn your <span className="primary-text-gradient">inbox</span> into the ultimate <span className="primary-text-gradient">remote board</span>
      </h1>
      
      <p className="text-2xl max-w-4xl my-16">
        Remote Radar pulls in hundreds of remote job listings from around the web and sends them to your inbox every day.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-4 md:pb-8">
        <LitButton
          title="Browse Jobs"
          icon={<IconBriefcase />}
          position="right"
        />

        <LitButton
          title="Sign Up Free"
          icon={<IconArrowDown />}
          position="right"
        />
      </div>

      <ContainerScroll>
        <Image
          src="/devexchange.webp"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
