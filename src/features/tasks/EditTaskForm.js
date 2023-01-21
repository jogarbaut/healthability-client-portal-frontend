import { useState, useEffect } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import moment from "moment"

const EditTaskForm = ({ task, users }) => {
  const { isTherapist, isAdmin } = useAuth()

  const [updateTask, { isLoading, isSuccess, isError, error }] = useUpdateTaskMutation()

  const [deleteTask, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteTaskMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
  const [dueDate, setDueDate] = useState(moment.utc(task.dueDate).format("YYYY-MM-DD"))
  const [completed, setCompleted] = useState(task.completed)
  const [userId, setUserId] = useState(task.user)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setBody("")
      setDueDate("")
      setUserId("")
      navigate("/dash/tasks")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onBodyChanged = (e) => setBody(e.target.value)
  const onDueDateChanged = (e) => setDueDate(e.target.value)
  const onCompletedChanged = (e) => setCompleted((prev) => !prev)
  const onUserIdChanged = (e) => setUserId(e.target.value)

  const canSave = [title, body, dueDate, userId].every(Boolean) && !isLoading

  const onSaveTaskClicked = async (e) => {
    if (canSave) {
      await updateTask({ id: task.id, user: userId, title, body, dueDate, completed })
    }
  }

  const onDeleteTaskClicked = async () => {
    await deleteTask({ id: task.id })
  }

  const created = new Date(task.createdAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
  const updated = new Date(task.updatedAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    )
  })

  const errClass = isError || isDelError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ""
  const validBodyClass = !body ? "form__input--incomplete" : ""
  const validDueDateClass = !dueDate ? "form__input--incomplete" : ""

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""

  let deleteButton = null
  if (isTherapist || isAdmin) {
    deleteButton = (
      <button className="icon-button" title="Delete" onClick={onDeleteTaskClicked}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    )
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Task #{task.task}</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" onClick={onSaveTaskClicked} disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input className={`form__input ${validTitleClass}`} id="note-title" name="title" type="text" autoComplete="off" value={title} onChange={onTitleChanged} />

        <label className="form__label" htmlFor="note-body">
          Body:
        </label>
        <textarea className={`form__input form__input--text ${validBodyClass}`} id="note-body" name="note-body" value={body} onChange={onBodyChanged} />

        <label className="form__label" htmlFor="dueDate">
          Due Date:
        </label>
        <input className={`form__input ${validDueDateClass}`} id="dueDate" name="dueDate" type="date" value={dueDate} onChange={onDueDateChanged} />

        <div className="form__row">
          <div className="form__divider">
            <label className="form__label form__checkbox-container" htmlFor="note-completed">
              Exercise Complete:
              <input className="form__checkbox" id="note-completed" name="completed" type="checkbox" checked={completed} onChange={onCompletedChanged} />
            </label>

            {isTherapist || isAdmin ? (
              <>
                <label className="form__label form__checkbox-container" htmlFor="note-username">
                  ASSIGNED TO:
                </label>
                <select id="note-username" name="username" className="form__select" value={userId} onChange={onUserIdChanged}>
                  {options}
                </select>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  )

  return content
}

export default EditTaskForm
