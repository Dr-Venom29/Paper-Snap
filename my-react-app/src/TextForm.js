import React from 'react'

export default function TextForm(props) {
  return (
   <>
   <h1>{props.heading}</h1>
    <div className="mb-3">
    <textarea className="form-control"  id="mybox" rows="3"></textarea>
    </div>
    <button className="btn btn-primary">Convert to Uppercase</button>
    </>
  )
}

<div className="container ">
      <TextForm heading="What can I help with?"/>
    </div>
