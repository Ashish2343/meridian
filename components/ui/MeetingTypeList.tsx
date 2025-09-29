'use client'
import React, { useState } from 'react'
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
    <section className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2'>
        <h2 className="col-span-full text-xl font-semibold text-gray-200">Quick Actions</h2>
        <HomeCard
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description="Start Instant Meeting"
            className="hover:border-indigo-500"
            handleClick={() => setMeetingState('isInstantMeeting')}
            
        />
        <HomeCard
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description="Plan your meeting"
            className="hover:border-purple-500"
            handleClick={() => setMeetingState('isScheduleMeeting')}
            
        />
          <h2 className="col-span-full text-xl font-semibold text-gray-200 mt-6">Collaboration</h2>

        <HomeCard
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="Start Instant Meeting"
            className="hover:border-green-500"
            handleClick={() => setMeetingState('isJoinMeeting')}
           
        />

        <HomeCard
            img="/icons/recordings.svg"
            title="Recordings"
            description="View your recordings"
            className="hover:border-yellow-500"
            handleClick={() => router.push('/recordings')}
           
        />

         <h2 className="col-span-full text-xl font-semibold text-gray-200 mt-6">Collaboration</h2>
        <div className="col-span-full bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
         <ul className="space-y-3 text-gray-300">
            <li>✅ Joined "Team Sync" yesterday</li>
             <li>📼 Recording saved: "Project Kickoff"</li>
             <li>📅 Scheduled "Client Call" for Oct 3rd</li>
         </ul>
         </div>

        {!callDetails ? (
  <MeetingModal
    isOpen={meetingState === 'isScheduleMeeting'}
    onClose={() => setMeetingState(undefined)}
    title="Create Meeting"
    handleClick={createMeeting}
  >
    <div className="flex flex-col gap-4">
      {/* Description */}
      <label className="text-base font-normal leading-6 text-sky-200" htmlFor="description">
        Description
      </label>
      <Textarea
        id="description"
        placeholder="Enter meeting description"
        className="border-none bg-gray-800 p-2 rounded focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setValues({ ...values, description: e.target.value })}
      />

      {/* Date & Time Picker */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-normal leading-6 text-sky-200">
          Select Date and Time
        </label>
        <ReactDatePicker
          selected={values.dateTime}
          onChange={(date) => setValues({ ...values, dateTime: date! })}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full rounded bg-gray-800 p-2 text-white focus:outline-none"
        />
      </div>
    </div>
  </MeetingModal>
) : (
  <MeetingModal
    isOpen={meetingState === 'isScheduleMeeting'}
    onClose={() => setMeetingState(undefined)}
    title="Meeting Created"
    className="text-center"
    handleClick={() => {
      navigator.clipboard.writeText(meetingLink);
      toast('Link copied');
    }}
    image="/icons/checked.svg"
    buttonIcon="/icons/copy.svg"
    buttonText="Copy Meeting Link"
  />
)}

{/* Instant Meeting */}
<MeetingModal
  isOpen={meetingState === 'isInstantMeeting'}
  onClose={() => setMeetingState(undefined)}
  title="Start Instant Meeting"
  className="text-center"
  buttonText="Start Meeting"
  handleClick={createMeeting}
/>

{/* Join Meeting */}
<MeetingModal
  isOpen={meetingState === 'isJoinMeeting'}
  onClose={() => setMeetingState(undefined)}
  title="Type the Link Here"
  className="text-center"
  buttonText="Join Meeting"
  handleClick={() => router.push(values.link)}
>
  <Input
    placeholder="Meeting Link"
    className="border-none p-2 rounded bg-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0"
    onChange={(e) => setValues({ ...values, link: e.target.value })}
  />
</MeetingModal>
    </section>
  )
}

export default MeetingTypeList
