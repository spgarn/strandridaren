import React from 'react'
import CCalendar from 'react-calendar';
import * as css from './Calendar.css'


const Calendar = ({...rest}) => {
  return (
    <CCalendar className={`${css}`} {...rest}></CCalendar>
  )
}

export default Calendar