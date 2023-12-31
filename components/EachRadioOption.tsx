import { RadioGroup } from '@headlessui/react'
import { BiCheckCircle } from 'react-icons/bi';


function EachRadioOption( type: { id: string; name: string; description: string; color: string; } ): React.JSX.Element {
    return <RadioGroup.Option key={ type.id } value={ type.id } className={ ( { active, checked } ) => `
                        ${ active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300" : '' }
                        ${ checked ? `${ type.color } bg-opacity-75 text-white` : 'bg-white' }
                        relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                    `}>

        { ( { active, checked } ) => (
            <>
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                        <div className="text-sm">
                            <RadioGroup.Label as='p' className={ `font-medium ${ checked ? 'text-white' : 'text-gray-900' }` }>
                                { type.name }
                            </RadioGroup.Label>

                            <RadioGroup.Description as='span' className={ `inline ${ checked ? 'text-white' : 'text-gray-900' }` }>
                                <span>{ type.description }</span>
                            </RadioGroup.Description>
                        </div>
                    </div>

                    { checked && (
                        <div className="shrink-0 text-white">
                            <BiCheckCircle className='h-6 w-6' />
                        </div>
                    ) }
                </div>
            </>
        ) }
    </RadioGroup.Option>;
}

export default EachRadioOption
