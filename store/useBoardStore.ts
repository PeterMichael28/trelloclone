import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { toast } from "react-hot-toast";
import { create } from "zustand";

interface BoardStore {
    board: Board;
    getBoard: () => void;
    setBoardState: ( board: Board ) => void;
    updateTodoInDb: ( todo: Todo, columnId: TypedColumn ) => void;
    searchString: string;
    setSearchString: ( searchString: string ) => void;
    deleteTask: ( taskIndex: number, todoId: Todo, id: TypedColumn ) => void;
    taskInput: string;
    setTaskInput: ( input: string ) => void;
    taskType: TypedColumn;
    setTaskType: ( columnId: TypedColumn ) => void;
    imageFile: File | null;
    setImageFile: ( image: File | null ) => void;
    addNewTaskToDb: (todo: string, columnId: TypedColumn, image: File | null) => void
}

export const useBoardStore = create<BoardStore>( ( set, get ) => ( {
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn()
        set({board})
    },
    setBoardState: ( board: Board ) => set( { board } ),
    updateTodoInDb: async ( todo, columnId ) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },
    searchString: "",
    setSearchString: ( searchString ) => set({searchString}),
    deleteTask: async ( taskIndex: number, todo: Todo, id: TypedColumn ) => {
        const newColumns = new Map( get().board.columns );


        // delete todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1)

        set({board: {columns: newColumns}})


        // if there is an image, delete it from the storage
        if ( todo.image ) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }


        // delete the rest of the documents
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )

        toast.success('Successfully Deleted!')
    },

    taskInput: '',
    setTaskInput: ( input: string ) => set( { taskInput: input } ),
    taskTypeInput: '',
    setTaskType: ( columnId: TypedColumn ) => set( { taskType: columnId } ), 
    taskType: 'todo',
    imageFile: null,
    setImageFile: (image: File | null) => set({imageFile: image}),
    addNewTaskToDb: async ( todo: string, columnId: TypedColumn, image: File | null ) => {
        let file: Image | undefined


        // save the image to appwrite storage
        if ( image ) {
            const fileUpload = await uploadImage(image)
            if ( fileUpload ) {
                file = {
                    bucketId: fileUpload.bucketId,
                    fileId: fileUpload.$id
                }
            }
        }

        // create document in appwrite

       const {$id} = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && {image: JSON.stringify(file)})
            }
        )

        set({taskInput: ''})

        set( ( state ) => {
            const newCol = new Map(state.board.columns)

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && {image: file})
            }

            const column = newCol.get( columnId );

            if ( !column ) {
                newCol.set( columnId, {
                    id: columnId,
                    todos: [newTodo],
                })
            } else {
                newCol.get(columnId)?.todos.push(newTodo)
            }

          
            return {
                board: {
                    columns: newCol
                }
            }
        })
    }
}))