import { useState } from 'react'

const useForm = (callback, initialState={}, resetOnSubmit=true) => {

    const [values, setValues] = useState(initialState)

    const handleChange = (event) => {

        const value = event.target.value
        const key = event.target.name

        setValues(prevValues => ({...prevValues, [key]: value}))
    }

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault()
        }
        callback()
        if (resetOnSubmit) resetValues()
    }

    const resetValues = () => {
        setValues(initialState)
    }

    return {
        handleChange,
        handleSubmit,
        resetValues,
        setValues,
        values
    }
}

export default useForm