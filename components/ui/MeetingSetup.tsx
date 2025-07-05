'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect } from 'react'
import { Button } from './button';

const MeetingSetup = ({ setIsSetupComplete }: {setIsSetupComplete: (values: boolean)=> void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = React.useState(false);
  const call =  useCall();

  if(!call) throw new Error('use call mustbe used in streamcall component');
  
  useEffect(()=>{
    if(isMicCamToggledOn){
      call?.camera.disable();
      call?.microphone.disable();
    }else{
      call?.camera.enable();
      call?.microphone.enable();
    }
  },[isMicCamToggledOn, call?.camera, call?.microphone])


  return (
    <div className = 'flex h-screen w-full flex-col items-center justify-center gap-4 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview/>
      <div className='flex h-16 items-center justify-center gap-3'>
        <label htmlFor="" className='flex items-center justify-center font-medium gap-2'>
          <input type="checkbox" checked={isMicCamToggledOn} onChange={(e)=> setIsMicCamToggledOn(e.target.checked)}/>
          Mute/Unmute
        </label>
        <DeviceSettings/>
      </div>
      <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={()=> { call?.join(); setIsSetupComplete(true); }}>
        Join Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup
