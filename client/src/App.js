import React,{useState,useEffect} from 'react'
import axios from 'axios'

function App() {
  const [state,setState]=useState([])
  useEffect(()=>{
    const fetchData = async ()=>{
      const result = await (await axios.get('/api/userlist')).data
      console.log(result,'result')
      setState(result.data)
    }
    fetchData()
  },[])
  return (
    <div>
      {
        state.map((elm,key)=>(
          <div key={key}>
            <h5>{elm.contactNum} - {elm.email}</h5>
          </div>
        ))
      }
    </div>
  )
}

export default App
