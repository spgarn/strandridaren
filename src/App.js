
import '../src/App.css';
import React, { useRef, useState, useEffect } from 'react'
import Calendar from './Components/Calendar/Calendar';
import 'react-calendar/dist/Calendar.css';
import useOutsideClick from './lib/useOutesideClick'
import dayjs from 'dayjs';
import Form from './Components/Form';
import image from './assets/skummes.jpeg'

var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)





function App() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentDate, setCurrentDate] = React.useState()
    const onClickDay = (event, value) => {
        setCurrentDate(event)
    }

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

    useEffect(() => {
        setStart(activeDate)
        setEnd(activeDate.add(4, 'hours'))
        setTotalTime(4)
    }, [currentDate])



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



    const setTime = (fn, value) => {
        const time = dayjs(value)
        fn(time)
        setDateChange(!dateChange)
    }



    const testData = [{ start: dayjs().format(), end: dayjs().add(4, 'hours').format() }, { start: dayjs().add(5, 'day').format(), end: dayjs().add(5, 'day').add(24, 'hours').format() }]



    return (
        <div className="App" style={{ backgroundImage: `url(${image})` }}>
            <div style={{ fontSize: '42px' }}>
                Välkommen till Strandridarens släputhyrning!

            </div>
            <Calendar minDate={now.toDate()} maxDate={now.add(3, 'month').toDate()} onClickDay={(value, event) => onClickDay(value, event)} showDoubleView
                tileClassName={({ date }) => {
                    if (dayjs(date).format('YYYY/MM/DD') === dayjs(testData[1].start).format('YYYY/MM/DD')) return 'blocked-tile'
                }}></Calendar>
            <div ref={ref}>

                {isOpen && <div className='Modal'>Vänligen fyll i när du tänkt att hämta släpet.

                    <div ><span>Hämta:</span><input min={dayjs().format('YYYY-MM-DDThh:mm')} defaultValue={start.format('YYYY-MM-DDTHH:MM')} onChange={(event) => setTime(setStart, event.target.value)} type='datetime-local'></input></div>
                    <div ><span>Lämna:</span> <input min={dayjs().add(4, 'hours').format('YYYY-MM-DDThh:mm')} max={activeDate.add(3, 'month').toDate()} defaultValue={end.format('YYYY-MM-DDTHH:MM')} onChange={(event) => setTime(setEnd, event.target.value)} type='datetime-local'></input></div>
                    <Form start={start} end={end} price={price} hours={totalTime} />
                    <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}>
                        <span>
                            Total tid: {totalTime}
                        </span>
                        <span>
                            Pris: {price}
                        </span>
                    </div>
                </div>}
                <button className='Button' style={{ marginTop: '32px' }} onClick={() => setIsOpen(true)}>Välj tid</button>
            </div>
        </div >
    );
}

export default App;
