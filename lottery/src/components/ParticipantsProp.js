import React from 'react'
import {FaUserAstronaut} from "react-icons/fa";
const ParticipantsProp = (props) => {

  return (
    <div className='users'> 
      <FaUserAstronaut className='usericon' />:<p>{props.address}</p>
    </div>
  )
}

export default ParticipantsProp;