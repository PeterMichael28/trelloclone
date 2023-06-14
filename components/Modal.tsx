"use client"

import { useState, Fragment, useRef, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/useBoardStore';
import TaskRadioGroup from './TaskRadioGroup';
import Image from 'next/image';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'

function Modal() {
 
  const router = useRouter()
const {isOpen, onOpen, onClose} = useModalStore()
const [loading, setLoading] = useState<boolean>(false)
const {board, taskInput, taskType, setTaskInput, setImageFile, imageFile, addNewTaskToDb} = useBoardStore()

const imageRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if(!taskInput) return

    // add task

    await addNewTaskToDb(taskInput, taskType, imageFile)
    toast.success('Task Added Successfully!')
    setLoading(false)
    setImageFile(null)
    onClose()
    router.refresh()
}

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} as='form' onSubmit={handleSubmit} className='relative z-10'>

      <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

    <div className="fixed inset-0 flex overflow-y-auto items-center justify-center">
    <div className="flex min-h-full text-center items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Panel className='w-full max-w-[34rem] mx-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
            <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 pb-2'>
                Add a Task
            </Dialog.Title>

            <div className='mt-2'>
                <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder='enter you task here...' className='w-full border border-gray-300 rounded-md outline-none p-5' />
            </div>

          {/* radio options */}
          <TaskRadioGroup />


          {/* image picker nput field */}
          <div className=''>

          {!imageFile && (<button 
              type='button' 
              onClick={() => {
              imageRef.current?.click()
            }} 
              className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
              <MdAddPhotoAlternate className='h-6 w-6 mr-2 inline-block'/>
              Upload Image
            </button>)}
            {imageFile && (
              <Image
                alt='Uploaded Image'
                width={200}
                height={200}
                className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed'
                src={URL.createObjectURL(imageFile)}
                onClick={() => {
                  setImageFile(null)
                }}
               />
            )}
              <input type='file' ref={imageRef} hidden onChange={(e) => {
                if(!e.target.files![0].type.startsWith("image/")) return
                setImageFile(e.target.files![0])
              }} />
          </div>


          <div className='mt-4'>
            <button type='submit' onClick={() => {}} disabled={!taskInput || loading} className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible;ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'>Add Task</button>
          </div>
          </Dialog.Panel>
        </Transition.Child>

        </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal;