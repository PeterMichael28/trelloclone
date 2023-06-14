"use client"
import { useBoardStore } from '@/store/useBoardStore';
import React, {useEffect} from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column'


type Props = {}

const Board = (props: Props) => {

    const {getBoard, board, setBoardState, updateTodoInDb} = useBoardStore()

    useEffect(() => {
        getBoard()
    }, [getBoard])



    const handleDragEnd = ( results: DropResult  ) => {
      const { destination, source, type } = results;

      // if users dragged card outside the box
      if ( !destination ) return;

      // handle column drag
      if ( type === 'column' ) {
        const entries = Array.from( board.columns.entries() );
        const [removed] = entries.splice(source.index, 1)
        entries.splice(destination.index, 0, removed)
        const rearrangedColumns = new Map(entries);
        setBoardState({...board, columns: rearrangedColumns});
      }

      // handle card drag
      const  columns = Array.from(board.columns)
      const startColIndex = columns[Number(source.droppableId)]
      const finishColIndex = columns[Number(destination.droppableId)]

      const startCol: Column = {
        id: startColIndex[0] && startColIndex[0],
        todos: startColIndex[1].todos
      }

      const finishCol: Column = {
        id: finishColIndex[0] && finishColIndex[0],
        todos: finishColIndex[1].todos
      }

     if(!startCol || !finishCol) return

     if( source.index === destination.index && startCol === finishCol) return

      const newTodos = startCol.todos;
      const [ movedTodo ] = newTodos.splice( source.index, 1 )
      

      if ( startCol.id === finishCol.id ) {
          // same column task drag
          newTodos.splice(destination.index, 0, movedTodo);
        const newCol = {
            id: startCol.id,
            todos: newTodos
          }

          const newColumns = new Map(board.columns)
        

          setBoardState({...board, columns: newColumns})
      } else {
        // dragging to another column
        const finishedTodos = Array.from(finishCol.todos)
        finishedTodos.splice( destination.index, 0, movedTodo );

        const newColumns = new Map(board.columns)
        const newCol = {
          id: startCol.id,
          todos: newTodos
        }

        newColumns.set(startCol.id, newCol)
        newColumns.set( finishCol.id, {
          id: finishCol.id,
          todos: finishedTodos
        })

        updateTodoInDb(movedTodo, finishCol.id)
     

        setBoardState({...board, columns: newColumns})
      }

    }
    
  return (

   
      <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='board' direction='horizontal' type='column'>
              { ( provided ) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-7xl gap-5 mx-auto '
                  >
                      {/* rendering all columns */}
                    {Array.from(board.columns.entries()).map(([id, column], i) => (
                      <Column key={ id } id={ id } todos={ column.todos } index={ i } />
                    ))}
                  </div>
              )}
          </Droppable>
    </DragDropContext>
  )
}

export default Board