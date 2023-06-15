"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import { FiSearch } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { useBoardStore } from '@/store/useBoardStore';
import useDebounce from '@/lib/useDebounce';
import fetchSuggestion from '@/lib/fetchSuggestion';

type Props = {}

const Header = ( props: Props ) => {
    const {searchString,board, setSearchString} = useBoardStore()
    const [inp, setInp] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [suggestion, setSuggestion] = useState<string>('')
    const debounceValue = useDebounce(inp, 500) 
    const handleSubmit = () => {

    }

    useEffect(() => {
      setSearchString(debounceValue)
      }, [debounceValue])

    useEffect( () => {
          if(board.columns.size === 0) return
          setLoading(true)

        const fetchSuggestionsFromAi = async () => {
              const suggestions = await fetchSuggestion(board)
              setSuggestion(suggestions)
              setLoading(false)
          }

          fetchSuggestionsFromAi()
          
      }, [board])

     

  return (
      <header>

        <div className='flex flex-col md:flex-row p-5 items-center bg-gray-500/10 rounded-b-2xl'>

            <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-lg filter blur-3xl opacity-50 -z-50'></div>
            {/* logo */}
            <Image src='/assets/logo.webp' alt='logo' width={300} height={100} className='w-44 md:w-56 pb-10 md:pb-0 object-contain'/>

            <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
            {/* search */}
                <form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial' onSubmit={handleSubmit}>
                    <FiSearch className='h-6 w-6 text-gray-500'/>
                    <input type="text" placeholder="Search" className="flex-1 outline-none p-2" value={searchString} onChange={e => setInp(e.target.value)}/>
                </form>

                {/* Avatar */}
                <Avatar name='Michael Peter' round color='#0055D1' size='50'/>
            </div>
        </div>
       

       {/* suggestion */}
       <div className='flex items-center justify-center px-5 py-2 md:py-5'>
        <p className='flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055d1] p-5'>
            <BiUserCircle className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading ? "animate-spin" : ''}`}/>
           {(suggestion && !loading) ? suggestion : 'GPT is summarizing your tasks for the day...'}
        </p>
       </div>
    </header>
  )
}

export default Header