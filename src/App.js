
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

    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [testData, setTestaData] = useState([])

    const API_URL = 'https://m6tpzrokn3.execute-api.eu-north-1.amazonaws.com/prod/GetBookings'

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])



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

    useEffect(() => {
        setTestaData(items.Items?.map(item => {
            return { start: dayjs(item.start), end: dayjs(item.end) }
        }))
    }, [isLoaded, items])




    const onClickDay = (event, value) => {
        setCurrentDate(event)
        const matchedDates = testData.filter(data => {
            return dayjs(event).add(1, 'second').isBetween(data.start, data.end, 'second') || dayjs(data.start).format('YYYY/MM/DD') === dayjs(event).format('YYYY/MM/DD') || dayjs(data.end).format('YYYY/MM/DD') === dayjs(event).format('YYYY/MM/DD')
        })
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
        const isBetween = todaysBookings.find((booking) => {
            return start.isBetween(dayjs(booking.start).subtract(1, 'minute'), dayjs(booking.end).add(1, 'minute'), 'minute') || end.isBetween(dayjs(booking.start).subtract(1, 'minute'), dayjs(booking.end).add(1, 'minute'), 'minute')
        })

        const overFlow = todaysBookings.find((booking) => {
            return start.isBefore(dayjs(booking.start), 'minute') && end.isAfter(dayjs(booking.end), 'minute')
        })

        setIsBlocked(isBetween || overFlow)

    }, [dateChange, currentDate, activeDate])






    const setTime = (fn, value) => {
        const time = dayjs(value)
        fn(time)
        setDateChange(!dateChange)
    }



    if (!isLoaded) return <div></div>


    return (
        <div className="App" style={{ backgroundImage: `url(${image})` }}>
            <div style={{ fontSize: '42px', color: 'white', textShadow: '2px 4px 3px rgba(0,0,0,0.3)' }}>
                Välkommen till Strandridarens släputhyrning!
                <p style={{ fontSize: '26px' }}>Swish: 123 284 81 17</p>
                <p style={{ fontSize: '26px' }}> Kontakt: 070 - 231 3101</p>

            </div>
            <Calendar minDate={now.toDate()} maxDate={now.add(3, 'month').toDate()} onClickDay={(value, event) => onClickDay(value, event)} showDoubleView={!isMobile}
                tileClassName={({ date }) => {
                    const matchedDates = testData?.filter(data => dayjs(date).add(1, 'second').isBetween(data.start, data.end, 'second') || dayjs(data.start).format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD') || dayjs(data.end).format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD'))
                    if (matchedDates?.length === 1) return 'blocked-tile1'
                    if (matchedDates?.length === 2) return 'blocked-tile2'
                    if (matchedDates?.length >= 3) return 'blocked-tile3'
                }}
            ></Calendar>
            <div ref={ref}>

                {isOpen && <div className='Modal'>Vänligen fyll i när du tänkt att hämta släpet.

                    <div ><span>Hämta:</span><input min={dayjs().format('YYYY-MM-DDTHH:mm')} value={start.format('YYYY-MM-DDTHH:mm')} onChange={(event) => setTime(setStart, event.target.value)} type='datetime-local'></input></div>
                    <div ><span>Lämna:</span> <input min={dayjs().add(4, 'hours').format('YYYY-MM-DDTHH:mm')} max={activeDate.add(3, 'month').toDate()} value={end.format('YYYY-MM-DDTHH:mm')} onChange={(event) => setTime(setEnd, event.target.value)} type='datetime-local'></input></div>
                    <Form isBlocked={isBlocked} start={start} end={end} price={price} hours={totalTime} />
                    <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}>
                        <span>
                            Total tid: {totalTime}
                        </span>
                        <span>
                            Pris: {price}
                        </span>
                    </div>
                    {todaysBookings.map((data, index) => {
                        return <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid gray', padding: '4px', borderRadius: '8px' }} key={index}>{dayjs(data.start).format('YYYY/MM/DD HH:mm')} - {dayjs(data.end).format('YYYY/MM/DD HH:mm')}</div >
                    })}
                </div>}
                <button className='Button' style={{ marginTop: '32px' }} onClick={() => setIsOpen(true)}>Välj tid</button>
            </div>
        </div >
    );
}

export default App;
