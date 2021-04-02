import React, { useState, useEffect } from 'react'
import './App.css'
import personService from './services/persons'

const Notification = ({ message }) =>
  message ? <div className='notification'>{message}</div> : null
const ErrorMessage = ({ errorMessage }) =>
  errorMessage ? <div className='error'>{errorMessage}</div> : null

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = ({
  name,
  number,
  onChangeName,
  onChangeNumber,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onChangeName} />
    </div>
    <div>
      number: <input value={number} onChange={onChangeNumber} />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const changedPerson = persons.find((p) => p.name === newName)
    if (changedPerson) {
      if (
        window.confirm(
          `${changedPerson.name} is already added to phonebook, replace the old number with a new one? `
        )
      ) {
        changedPerson.number = newNumber
        personService
          .update(changedPerson.id, changedPerson)
          .then((returnedPerson) => {
            setMessage(`Updated ${changedPerson.name}.`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            )
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            // const errMsg = `Information of ${changedPerson.name} has been removed from server`
            const errMsg = error.response.data
            console.log(errMsg)
            setErrorMessage(errMsg)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setMessage(`Added ${returnedPerson.name}.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          const errMsg = error.response.data.error
          console.log(errMsg)
          setErrorMessage(errMsg)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (personObject) => {
    if (window.confirm('Delete ' + personObject.name + '?')) {
      personService
        .del(personObject.id)
        // eslint-disable-next-line no-unused-vars
        .then((returnedPerson) => {
          setMessage(`Deleted ${personObject.name}.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setPersons(persons.filter((person) => person.id !== personObject.id))
        })
        .catch((error) => {
          //          const errMsg = `Error in deleting ${personObject.name}`
          const errMsg = error.response.data
          console.log(errMsg)
          setErrorMessage(errMsg)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = newFilter
    ? persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    )
    : persons

  const hookPersons = () => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }

  useEffect(hookPersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorMessage errorMessage={errorMessage} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        onChangeName={handleNameChange}
        number={newNumber}
        onChangeNumber={handleNumberChange}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
