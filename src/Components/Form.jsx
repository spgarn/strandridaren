import { useForm, ValidationError } from '@formspree/react';
import React from 'react'
import toast from 'react-hot-toast';

function ContactForm({start,end,hours,price,isBlocked}) {
    const [state, handleSubmit] = useForm("xgedglnw");

    const handleSend = async (e) => {
        e.preventDefault()
        const data = JSON.stringify({hours,price,start,end})
       const response = await fetch('https://m6tpzrokn3.execute-api.eu-north-1.amazonaws.com/prod/bookTrailer',{
            method:'POST',
            body:data
        })
        const body = await response.json()
        if(body.status === 200) {
           return handleSubmit(e)
        }
        if(body.status === 403) {
          return toast.error('Tiden är redan bokad. Ladda om sidan för att se alla bokade tider.')}
  
    }

    if (state.succeeded) {
        toast.success(`Du har bokat ett släp i ${hours} timmar till ett pris om ${price} kr`)
        return <>
        <p>Nu är det bokat.</p> 
        <p>Swisha Strandridaren {price} kr, på nummer 123 284 81 17.</p>
        </>
    }
   
    
    return (
        <form className='Form' onSubmit={handleSend}>
            <div style={{gridArea:'a'}}>

<label  style={{margin:'8px 8px 8px 0px'}}  htmlFor="firstName">
          Förnamn
        </label>
                 <input
          id="firstName"
          type={'text'}
          name="Förnamn"
          required
          />
        <ValidationError 
          prefix="Förnamn" 
          field="firstName"
          errors={state.errors}
          />
          </div>
            <div style={{gridArea:'b'}}>

                <label style={{margin:'8px 8px 8px 0px'}}  htmlFor="lastName">
          Efternamn
        </label>
                 <input
          required
          id="lastName"
          type={'text'}
          name="Efternamn"
          />
        <ValidationError 
          prefix="Efternamn" 
          field="lastName"
          errors={state.errors}
          />
          </div>
         
          <div style={{gridArea:'c'}}>

         <label style={{margin:'8px 8px 8px 0px'}}  htmlFor="phone">
          Telefonnummer
        </label>
        <input
          id="phone"
          type="phone" 
          name="Telefonnummer"
          required
          />
        <ValidationError 
          prefix="Phone" 
          field="phone"
          errors={state.errors}
          />
          </div>
         <input className='hiddenInput' name="Start" style={{opacity:0}} id="start" readOnly value={start.format('HH-DD/MM/YYYY')}></input>
         <input className='hiddenInput'  name="Slut" style={{opacity:0}} id="end" readOnly value={end.format('HH-DD/MM/YYYY')}></input>
         <input className='hiddenInput'  name="Pris" style={{opacity:0}} id="pris" readOnly value={price}></input>
         <input className='hiddenInput'  name="Timmar" style={{opacity:0}} id="end" readOnly value={hours}></input>
   
        <button style={{gridArea:'e',width:'75%',justifySelf:'center'}} className={isBlocked ? 'Disabled' : 'Button'} type="submit" disabled={isBlocked || state.submitting}>
          Skicka
        </button>
      </form>
   
    );
  }

const Form = ({start,end,hours,price,isBlocked}) => {
    
  return (
    <ContactForm isBlocked={isBlocked} start={start} end={end} hours={hours} price={price}/>
  )
}

export default Form