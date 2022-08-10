
import '../src/App.css';
import React, { useRef, useState, useEffect } from 'react'
import Calendar from './Components/Calendar/Calendar';
import 'react-calendar/dist/Calendar.css';
import useOutsideClick from './lib/useOutesideClick'
import dayjs from 'dayjs';
import Form from './Components/Form';
import image from './assets/skummes.jpeg'
import useCheckMediaWidth from './lib/useCheckMediaWidth'

var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)





function App() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentDate, setCurrentDate] = React.useState()
    const isMobile = useCheckMediaWidth()


    const ref = useRef();

    useOutsideClick(ref, () => {
        setIsOpen(false)
    });

    const now = dayjs()
    const activeDate = dayjs(currentDate)

    const [start, setStart] = useState(activeDate)
    const [end, setEnd] = useState(activeDate)
    const [price, setPrice] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [dateChange, setDateChange] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [todaysBookings, setTodaysBookings] = useState([])


    useEffect(() => {
        setStart(activeDate)
        setEnd(activeDate.add(4, 'hours'))
        setTotalTime(4)
    }, [currentDate])

    const testData = [{ start: dayjs().add(2, 'day').format(), end: dayjs().add(2, 'day').add(4, 'hours').format() }, { start: dayjs().format(), end: dayjs().add(4, 'hours').format() }, { start: dayjs().add(5, 'hours').format(), end: dayjs().add(9, 'hours').format() }, { start: dayjs().add(5, 'day').format(), end: dayjs().add(5, 'day').add(4, 'hours').format() }, { start: dayjs().add(5, 'day').add(5, 'hours').format(), end: dayjs().add(5, 'day').add(9, 'hours').format() }, { start: dayjs().add(5, 'day').add(10, 'hours').format(), end: dayjs().add(5, 'day').add(14, 'hours').format() }]

    const onClickDay = (event, value) => {
        setCurrentDate(event)
        const matchedDates = testData.filter(data => dayjs(data.start).format('YYYY/MM/DD') === dayjs(event).format('YYYY/MM/DD') || dayjs(data.end).format('YYYY/MM/DD') === dayjs(event).format('YYYY/MM/DD'))
        setTodaysBookings(matchedDates)
    }

    const onBook = () => {
        const hours = end.diff(start, 'hours')


        if (hours) setTotalTime(hours)
        if (hours === 0) setTotalTime(0)

        if (hours <= 4) { setPrice(80) }
        if (hours > 4 && hours <= 8) { setPrice(130) }
        if (hours > 8) {
            const price = hours > 24 ? 200 * Math.round((hours / 24)) : 200
            setPrice(price)
        }
    }

    useEffect(() => {
        onBook()
    }, [dateChange])

    useEffect(() => {
        const booked = todaysBookings.find(booking => start.isBetween(dayjs(booking.start), dayjs(booking.end), 'minute') || end.isBetween(dayjs(booking.start), dayjs(booking.end), 'minute'))
        if (booked) return setIsBlocked(true)
        setIsBlocked(false)
    }, [dateChange])



    const setTime = (fn, value) => {
        const time = dayjs(value)
        fn(time)
        setDateChange(!dateChange)
    }






    return (
        <div className="App" style={{ backgroundImage: `url(${image})` }}>
            <div style={{ fontSize: '42px', color: 'white', textShadow: '2px 4px 3px rgba(0,0,0,0.3)' }}>
                Välkommen till Strandridarens släputhyrning!
                <p style={{ fontSize: '26px' }}>Swish & Kontakt: 070 - 231 3101</p>

            </div>
            <Calendar minDate={now.toDate()} maxDate={now.add(3, 'month').toDate()} onClickDay={(value, event) => onClickDay(value, event)} showDoubleView={!isMobile}
                tileClassName={({ date }) => {
                    const matchedDates = testData.filter(data => dayjs(data.start).format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD') || dayjs(data.end).format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD'))
                    if (matchedDates.length === 1) return 'blocked-tile1'
                    if (matchedDates.length === 2) return 'blocked-tile2'
                    if (matchedDates.length >= 3) return 'blocked-tile3'
                }}
            ></Calendar>
            <div ref={ref}>

                {isOpen && <div className='Modal'>Vänligen fyll i när du tänkt att hämta släpet.

                    <div ><span>Hämta:</span><input min={dayjs().format('YYYY-MM-DDThh:mm')} defaultValue={start.format('YYYY-MM-DDTHH:MM')} onChange={(event) => setTime(setStart, event.target.value)} type='datetime-local'></input></div>
                    <div ><span>Lämna:</span> <input min={dayjs().add(4, 'hours').format('YYYY-MM-DDThh:mm')} max={activeDate.add(3, 'month').toDate()} defaultValue={end.format('YYYY-MM-DDTHH:MM')} onChange={(event) => setTime(setEnd, event.target.value)} type='datetime-local'></input></div>
                    <Form isBlocked={isBlocked} start={start} end={end} price={price} hours={totalTime} />
                    <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}>
                        <span>
                            Total tid: {totalTime}
                        </span>
                        <span>
                            Pris: {price}
                        </span>
                    </div>
                    {todaysBookings.map((data, index) => <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid gray', padding: '4px', borderRadius: '8px' }} key={index}>{dayjs(data.start).format('HH:MM')} - {dayjs(data.end).format('HH:MM')}</div >)}
                </div>}
                <button className='Button' style={{ marginTop: '32px' }} onClick={() => setIsOpen(true)}>Välj tid</button>
            </div>
        </div >
    );
}

export default App;
