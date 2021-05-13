import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Redirect(props) {
    const { id } = props.match.params

    return (
        <h1> {id} </h1>
    )
}

export default Redirect
