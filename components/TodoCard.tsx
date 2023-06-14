import getImageUrl from '@/lib/getImageUrl';
import { useBoardStore } from '@/store/useBoardStore';
import Image from 'next/image';
import React, {useState, useEffect} from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { BiXCircle } from 'react-icons/bi';


type Props = {
    i: number;
    todo: Todo;
    id: TypedColumn;
    innerRef: ( element: HTMLElement | null ) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({i, todo, id, draggableProps, dragHandleProps, innerRef}: Props) => {

  
  const [imageUrl, setImageUrl] = useState<string | null>('')

  useEffect( () => {
    if ( todo.image ) {
      const getImage = async () => {
        const url = await getImageUrl(todo.image!)

        if ( url ) {
          setImageUrl(url.toString())
        }
      }

      getImage()
    }
  }, [todo])
  
  const {deleteTask} = useBoardStore()
  return (
    <div {...draggableProps} {...dragHandleProps} ref={innerRef} className='bg-white rounded-md space-y-2 drop-shadow-md'>
        <div className='flex justify-between items-center p-5'>
              <p>{ todo.title }</p>
              <button className='text-red-500 hover:text-red-600' onClick={() => deleteTask(i, todo, id)}>
                  <BiXCircle className='ml-5 h-8 w-8' />
              </button>
        </div>

        
        {/* add image url */}
        {imageUrl && (
          <div className='h-full w-full rounded-b-md'>
             <Image
                alt='Uploaded Image'
                width={400}
                height={400}
                className='w-full object-contain rounded-b-md'
                src={imageUrl}
               
               />
          </div>
             
            )}
    </div>
  )
}

export default TodoCard