'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from "sonner"
import { Textarea } from './textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from "@/components/ui/input"

const MeetingTypeList = () => {
    const router  = useRouter();
    const[meetingState, setMeetingState] = useState<'isScheduleMeeting'| 'isJoinMeeting' | 'isInstantMeeting' | undefined>();
    const {user} = useUser();
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link:''
    })
    
    const [callDetails, setCallDetails] = useState<Call>();


    const createMeeting = async () => {
        if(!client || !user) return;
        try{
            if(!values.dateTime) {
                toast('Please select a date and time for the meeting');
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default',id);
            if(!call) throw new Error('Call creation failed');
            const startsAt = values.dateTime.toISOString() || new Date().toISOString();
            const description = values.description || 'No description provided';
            await call.create({
                data:{
                    starts_at: startsAt,
                    custom:{
                        description: description,
                    }
                }
            })
            setCallDetails(call);
            if(!values.description){
                router.push(`/meeting/${call.id}`)
            }
            toast('Meeting created successfully');

        }catch(error){
            console.error('Error creating meeting:', error);
            toast('Failed to create meeting')
        }
    }


    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description="Start Instant Meeting"
            handleClick={() => setMeetingState('isInstantMeeting')}
            className='bg-orange-400'
        />
        <HomeCard
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description="Plan your meeting"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            className='bg-blue-500'
        />
        <HomeCard
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="Start Instant Meeting"
            handleClick={() => setMeetingState('isJoinMeeting')}
            className='bg-green-500'
        />

        <HomeCard
            img="/icons/recordings.svg"
            title="Recordings"
            description="View your recordings"
            handleClick={() => router.push('/recordings')}
            className='bg-purple-500'
        />

        {!callDetails ? (
        <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Create Meeting"
        handleClick = {createMeeting}
       >
        <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-200' htmlFor="">
                description
            </label>
            <Textarea className='border-none bg-red-500 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{
                setValues({...values, description:e.target.value})
            }} />
        </div>
            <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-red-500 p-2 focus:outline-none"
            />
        </div>
       </MeetingModal>
        ) : (
           <MeetingModal 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Meeting Created"
        className = "text-center"
        handleClick = {()=> {
            navigator.clipboard.writeText(meetingLink);
            toast ('link copied');
        }}
        image = '/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText = 'Copy meeting link'
        /> 
        )}
        <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Start Instant Meeting"
        className = "text-center"
        buttonText="Start Meeting"
        handleClick = {createMeeting}
        />
        <MeetingModal 
        isOpen={meetingState === 'isJoinMeeting'}
        onClose={()=> setMeetingState(undefined)}
        title="Type the Link here"
        className = "text-center"
        buttonText="Join Meeting"
        handleClick = {()=>[
            router.push(values.link)
        ]}
        >
        <Input placeholder='Meeting Link'
            className='border-none focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e)=> setValues({...values, link:e.target.value})}/>
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
