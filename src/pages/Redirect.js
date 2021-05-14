import React from 'react'

function Redirect(props) {
    const { id } = props.match.params

    return (
        <h1> {id} </h1>
    )
}

export default Redirect
