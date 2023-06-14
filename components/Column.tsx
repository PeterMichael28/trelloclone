import { Draggable,  Droppable} from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { useBoardStore } from '@/store/useBoardStore';
import { BiPlusCircle } from 'react-icons/bi';
import { useModalStore } from '@/store/ModalStore';


interface ColumnProps {
    id: TypedColumn;
    todos: Todo[];
    index: number
}


const idToColumnText: {
    [ Key in TypedColumn ]: string;
} = {
    todo: "To Do",
    inProgress: "In Progress",
    completed: 'Completed'

}

const Column = ({id, todos, index}: ColumnProps) => {

    const {searchString, setSearchString, setTaskType} = useBoardStore()
    const { onOpen} = useModalStore()

    const handleAddTodo = () => {
        
        setTaskType(id)
        onOpen()
    }

    return (
        <Draggable draggableId={id} index={index}>
            { ( provided ) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {/* inner droppable */}
                    <Droppable droppableId={index.toString()} type="card">
                        { ( provided, snapshot ) => (
                            <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`pb-2 p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}
                            >
                                <h2 className='flex justify-between font-bold items-center text-xl p-2'>
                                    { idToColumnText[ id ] }
                                    <span className='text-gray-500 bg-gray-200 rounded-full font-normal px-2 py-1 text-sm'>
                                        { !searchString ?
                                            todos.length :
                                            todos.filter( (todo) => todo.title.toLowerCase().includes( searchString.toLowerCase() ) ).length
                                        }</span>
                                </h2>

                                <div className='space-y-2'>
                                    { todos.map( ( todo, i ) => {
                                       
                                        if ( searchString && !todo.title.toLowerCase().includes( searchString.toLowerCase() ) ) return null;
                                        
                                        return (

                                        <Draggable index={i} key={todo.$id} draggableId={todo.$id}>
                                            { ( provided ) => (
                                                <TodoCard
                                                    todo={ todo }
                                                    i={ i }
                                                    id={id}
                                                    draggableProps = {provided.draggableProps}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    innerRef={provided.innerRef}
                                                />

                                               
                                             )}
                                        </Draggable>
                                       
                                    )})}


                                    {provided.placeholder}

                                    <div className='flex justify-end items-end'><button onClick={handleAddTodo} className='text-green-500 hover:text-green-600'><BiPlusCircle className='h-10 w-10'/></button></div>
                                </div>
                            </div>
                        )}
                    </Droppable>    
                </div>
            )}
        </Draggable>
    )
};

export default Column;