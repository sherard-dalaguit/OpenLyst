import LitButton from '@/components/ui/LitButton';
import { IconBriefcase, IconArrowDown } from '@tabler/icons-react';
import {Spotlight} from "@/components/ui/spotlight";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-screen overflow-x-hidden h-screen">
      <Spotlight />
      <h1 className="text-8xl font-semibold">
        Turn your <span className="primary-text-gradient">inbox</span> into the ultimate <span className="primary-text-gradient">remote board</span>
      </h1>
      
      <p className="text-2xl max-w-4xl my-16">
        Remote Radar pulls in hundreds of remote job listings from around the web and sends them to your inbox every day.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
    </div>
  );
}
