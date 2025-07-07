"use client";

import Image from "next/image";


import { Button } from "./button";
import { toast } from "sonner";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  //const { toast } = useToast();

  return (
    <section className="flex w-full flex-col justify-between 
    rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-5 
     hover:border-white 
         hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.15)]
         inset_0_0_20px_rgba(255,255,255,0.05)]
         hover:ring-1 
         hover:ring-white/30
     transition-colors
      xl:max-w-[568px] shadow-sm ">
  <article className="flex flex-col gap-4">
    <Image src={icon} alt="upcoming" width={40} height={40} />
    <div className="flex flex-col gap-1">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      <p className="text-sm text-neutral-400">{date}</p>
    </div>
  </article>

  {!isPreviousMeeting && (
    <div className="flex items-center gap-3 mt-4">
      <Button
        onClick={handleClick}
        className="rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm"
      >
        {buttonIcon1 && (
          <Image src={buttonIcon1} alt="feature" width={20} height={20} />
        )}
        &nbsp; {buttonText}
      </Button>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(link);
          toast("Link Copied");
        }}
        className="rounded border border-
        neutral-700 hover:border-blue-500 px-4 py-2 text-sm"
      >
        <Image
          src="/icons/copy.svg"
          alt="copy link"
          width={20}
          height={20}
        />
        &nbsp; Copy Link
      </Button>
    </div>
  )}
</section>

  );
};

export default MeetingCard;