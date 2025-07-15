import LitButton from '@/components/ui/LitButton';
import { IconBriefcase, IconArrowDown, IconSend } from '@tabler/icons-react';
import {Spotlight} from "@/components/ui/spotlight";
import Image from 'next/image';
import {ContainerScroll} from '@/components/ui/container-scroll-animation';
import { landingDetails } from '@/data';
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card';
import Footer from "@/components/Footer";
import {LandingNavbar} from "@/components/navigation/LandingNavbar";
import {Services} from "@/components/Services";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <div className="relative flex flex-col items-center justify-center text-center bg-black mx-auto pt-[32vh]">

        <Spotlight/>

        <div className="w-full absolute left-0 top-0 min-h-96 pointer-events-none rotate-180">
          <Image
            src="/footer-grid.svg"
            alt="grid"
            width={1000}
            height={1000}
            className="w-full h-full opacity-40 dark:opacity-70 filter invert dark:filter-none"
          />
        </div>

        <h1 className="text-8xl max-w-6xl font-semibold">
          Turn your <span className="primary-text-gradient">inbox</span> into the ultimate <span className="primary-text-gradient">remote board</span>
        </h1>

        <p className="text-2xl max-w-4xl my-16">
          Remote Radar pulls in hundreds of remote job listings from around the web and sends them to your inbox every day.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-4 md:pb-8 xl:pb-12">
          <LitButton
            title="Browse Jobs"
            icon={<IconBriefcase/>}
            position="right"
          />

          <LitButton
            title="Sign Up Free"
            icon={<IconArrowDown/>}
            position="right"
          />
        </div>

        <ContainerScroll>
          <Image
            src="/devexchange.webp"
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto max-w-6xl rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>

        <h1 className="text-6xl max-w-6xl font-semibold mb-20">
          Everything you need for a <span className="primary-text-gradient">winning remote job search</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl w-full items-center justify-center gap-8 mb-20">
          {landingDetails.map((detail, index) => {
            return (
              <div key={index} className="flex flex-col items-center text-xl font-medium gap-4">
                {detail.icon}
                <HoverCard>
                  <HoverCardTrigger className="hover:primary-text-gradient">{detail.title}</HoverCardTrigger>
                  <HoverCardContent>
                    {detail.des}
                  </HoverCardContent>
                </HoverCard>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-[20vh]">
          <LitButton
            title="Browse Jobs"
            icon={<IconBriefcase/>}
            position="right"
          />

          <LitButton
            title="Sign Up Free"
            icon={<IconArrowDown/>}
            position="right"
          />
        </div>

        <div className="text-start w-full">
          <Services />
        </div>

        <section id="get-alerts" className="-mt-[25vh] pb-[15vh] z-10 text-center">
          <h1 className="text-6xl font-semibold mb-12">
            <span className="primary-text-gradient">Never Miss a Remote Job</span>
          </h1>

          <p className="max-w-3xl text-xl pb-12">
            Sign up free to get the latest remote openings—filtered by your favorite categories—straight to your inbox.
          </p>

          <LitButton
            title="Create Job Alert"
            icon={<IconSend/>}
            position="right"
          />
        </section>

      </div>
      <Footer />
    </>
  );
}
