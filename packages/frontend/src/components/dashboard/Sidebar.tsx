import React from 'react'

const Sidebar = () => {
  return (
    <div className=' flex flex-col h-full border-solid border-2 p-4'>

      <div className='basis-1/2 flex flex-col justify-start gap-4'>
        <div className='border-solid border-2'>
          snow ball heading
        </div>
        <div className='border-solid border-2'>
          organization name
        </div>
        <div className='border-solid border-2'>
          project      </div>
        <div className='border-solid border-2'>
          settings
        </div>
      </div>

      <div className='basis-1/2  flex flex-col justify-end gap-4'>
        <div className='border-solid border-2'>
          documentation
        </div>
        <div className='border-solid border-2'>
          support
        </div>
      </div>

    </div>
  )
}

export default Sidebar
