'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
  try {
    await call.camera.disable();
    await call.microphone.disable();
    await call.endCall();
  } catch (e) {
    console.error('❌ call.endCall() threw:', e);
  }
  router.push('/dashboard');
  };

  return (
    <Button onClick={endCall} className="bg-red-500 hover:cursor-pointer">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;