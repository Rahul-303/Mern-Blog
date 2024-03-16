import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'

const OAuth = () => {
  return (
    <Button type='button' gradientDuoTone='greenToBlue' outline >
        <AiFillGoogleCircle className='w-6 h-6'/>
    </Button>
  )
}

export default OAuth