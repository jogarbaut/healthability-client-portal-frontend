import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewTaskMutation } from "./tasksApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NewTaskForm = ({ users }) => {
  const [addNewTask, { isLoading, isSuccess, isError, error }] = useAddNewTaskMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [userId, setUserId] = useState(users[0].id)

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setBody("")
      setDueDate("")
      setUserId("")
      navigate("/dash/tasks")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onBodyChanged = (e) => setBody(e.target.value)
  const onDueDateChanged = (e) => setDueDate(e.target.value)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave = [title, body, dueDate, userId].every(Boolean) && !isLoading

  const onSaveTaskClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewTask({ user: userId, title, body, dueDate })
    }
  }

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validBodyClass = !body ? "form__input--incomplete" : ""
  const validDueDateClass = !dueDate ? "form__input--incomplete" : ""

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveTaskClicked}>
        <div className="form__title-row">
          <h2>New Task</h2>
          <p>Assign a new task to your client that is private for the client. The client will be able to read and indicate when they complete the task.</p>
        </div>

        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input className={`form__input ${validTitleClass}`} id="title" name="title" type="text" autoComplete="off" value={title} onChange={onTitleChanged} />

        <label className="form__label" htmlFor="body">
          Notes:
        </label>
        <textarea className={`form__input form__input--text ${validBodyClass}`} id="body" name="body" value={body} onChange={onBodyChanged} />

        <label className="form__label" htmlFor="dueDate">
          Due Date:
        </label>
        <input className={`form__input ${validDueDateClass}`} id="dueDate" name="dueDate" type="date" value={dueDate} onChange={onDueDateChanged} />

        <label className="form__label form__checkbox-container" htmlFor="username">
          Assign To:
        </label>
        <select id="username" name="username" className="form__select" value={userId} onChange={onUserIdChanged}>
          {options}
        </select>

        <div className="form__action-buttons">
          <button className="icon-button" title="Save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </form>
    </>
  )

  return content
}

export default NewTaskForm
