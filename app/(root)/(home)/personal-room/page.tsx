'use client'
import { Button } from '@/components/ui/button';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';


const Table = ({title,description}:{title:string; description:string})=> (
  <div className='flex flex-col items-start gap-2 xl:flex-row'>
    <h1 className='text-base font-medium text-sky-50 lg:text-xl xl:min-w-32'>{title}:</h1>
    <h1 className='truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>{description}</h1>
  </div>
)
const PersonalRoom = () => {
  const {user} = useUser(); 
  const meetingId =  user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`

  const {call} = useGetCallById(meetingId!);
  const client = useStreamVideoClient();
  const router = useRouter();

  const startRoom = async()=>{
    if(!client || !user) return;

    if(!call){
      const newCall = client.call('default', meetingId!);
        await newCall.getOrCreate({
        data:{
          starts_at: new Date().toISOString(),
        }
      })
    }
    router.push(`/meeting/${meetingId}?personal=true`)
  }

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Personal Room
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
      <Table title='Topic' description={`${user?.username}'s meeting Room`}/>
      <Table title='Meeting ID' description={`${meetingId!}`}/>
      <Table title='Invite Link' description={`${meetingLink}`}/>
      </div>
      <div className='flex gap-5'>
        <Button className='bg-blue-500 hover:bg-red-500 
         hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.15)]
         inset_0_0_20px_rgba(255,255,255,0.05)]
         hover:ring-1 
         hover:ring-white/30' onClick={startRoom}>
          Start Meeting 
        </Button>
        <Button className='bg-dark-3'  onClick={()=>{
          navigator.clipboard.writeText(meetingLink);
          toast('link copied')
        }}>
          Copy Invitation
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom
