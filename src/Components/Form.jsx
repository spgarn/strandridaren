import { useForm, ValidationError } from '@formspree/react';
import React from 'react'
import toast from 'react-hot-toast';

function ContactForm({start,end,hours,price,isBlocked}) {
    const [state, handleSubmit] = useForm("xgedglnw");
    if (state.succeeded) {
        toast.success('Din tid är nu bokad.')
        const data = JSON.stringify({hours,price,start,end})
        try{
            fetch('https://m6tpzrokn3.execute-api.eu-north-1.amazonaws.com/prod/bookTrailer',{
                method:'POST',
                body:data
             
        })
    } catch (error){
        console.log(error)
    }
        return <>
        <p>Nu är det bokat.</p> 
        <p>Swisha kalle {price} kr, på nummer 070 - 231 3101</p>
        </>
        
    }
   
    
    return (
        <form className='Form' onSubmit={handleSubmit}>
            <div>

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
            <div>

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
          <div>

        <label style={{margin:'8px 8px 8px 0px'}} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email" 
          name="Email"
          required
          />
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          />
          </div>
          <div>

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
   
        <button  style={{gridArea:'e',width:'75%',justifySelf:'center'}} className={isBlocked ? 'Disabled' : 'Button'} type="submit" disabled={isBlocked || state.submitting}>
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