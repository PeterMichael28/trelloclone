

const formatTodosForAi = ( board: Board ) => {
    const todos = Array.from(board.columns.entries())


    const flatArray = todos.reduce( ( map, [ key, value ] ) => {
        map[key] = value.todos
        return map
    }, {} as {[Key in TypedColumn]: Todo[]})

    //  reduce to key: value[length]
    
    const flatArrayLength = Object.entries(flatArray).reduce( ( map, [ key, value ] ) => {
        map[key as TypedColumn] = value.length
        return map
    }, {} as {[Key in TypedColumn]: number})


    return flatArrayLength
}

export default formatTodosForAi;