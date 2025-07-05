import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Button } from './button'

interface MeetingModalProps{
    isOpen: boolean
    onClose: () => void
    title: string
    className?: string
    children?: React.ReactNode
    handleClick?: () => void
    buttonText?: string
    buttonIcon?: string
    image?: string
}

const MeetingModal = ({isOpen, onClose, title, className, children, handleClick, image ,buttonText, buttonIcon}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogTrigger></DialogTrigger>
  <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-black px-6 py-9 text-white '>
        <div className='flex flex-col gap-6'>
          {image && (
            <div className='flex  justify-center'>
                <Image src={image} alt={title} width={60} height={60} />
            </div>
          )}
          <h1 className={cn("text-3xl flex font-bold leading-[42px] justify-center" )}>{title}</h1>
          {children}
          <Button className='bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0' onClick={handleClick} >
             { buttonIcon && (
            <Image src={buttonIcon} alt='icon' width={13} height={13}/>
            )} &nbsp;
                {buttonText || 'Schedule Meeting'}
          </Button>
        </div>
  </DialogContent>
</Dialog>
  )
}

export default MeetingModal
