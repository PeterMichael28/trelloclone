"use client"

import { useBoardStore } from '@/store/useBoardStore';
import React from 'react'
import { RadioGroup } from '@headlessui/react'

import EachRadioOption from './EachRadioOption';

type Props = {}

const types = [
    {
        id: "todo",
        name: "Todo",
        description: "A new task to be completed",
        color: "bg-red-500"
    },
    {
        id: "inProgress",
        name: "In Progress",
        description: "A task currently in progress",
        color: "bg-yellow-500"
    },
    {
        id: "completed",
        name: "Completed",
        description: "A task that has already been completed",
        color: "bg-green-500"
    }
]

const TaskRadioGroup = (props: Props) => {

    const {taskType, setTaskType} = useBoardStore()
  return (
   
      <div className='w-full py-5'>
          <div className='mx-auto w-full max-w-md'>
          <RadioGroup value={taskType} onChange={(e) => setTaskType(e)}>
            
            <div className='space-y-2'>
                {types.map(type => (
                    EachRadioOption( type )
                ))}
            </div>
            
          </RadioGroup>
          </div>
      </div>
      
  )
}

export default TaskRadioGroup

