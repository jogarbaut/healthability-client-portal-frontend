import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faCircle } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useGetTasksQuery } from "./tasksApiSlice"
import { memo } from "react"
import { Tooltip } from "react-tooltip"

const Task = ({ taskId }) => {
  const { task } = useGetTasksQuery("tasksList", {
    selectFromResult: ({ data }) => ({
      task: data?.entities[taskId],
    }),
  })

  const navigate = useNavigate()

  if (task) {
    const createdString = new Date(task.createdAt).toLocaleString("en-US", { day: "numeric", month: "2-digit", year: "2-digit" })
    const dueDateString = new Date(task.dueDate).toLocaleString("en-US", { day: "numeric", month: "2-digit", year: "2-digit" })

    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))

    const handleEdit = () => navigate(`/dash/tasks/${taskId}`)

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {task.completed ? (
            <span className="note__status--completed" id="complete" data-tooltip-variant="warning">
              <FontAwesomeIcon icon={faCircle} />
              <Tooltip anchorId="complete" content="Task Completed" place="bottom" className="tooltip" />
            </span>
          ) : daysRemaining > 3 ? (
            <span className="note__status--open" id="incomplete" data-tooltip-variant="warning">
              <FontAwesomeIcon icon={faCircle} />
              <Tooltip anchorId="incomplete" content="Task Not Completed" place="bottom" className="tooltip" />
            </span>
          ) : (
            <span className="note__status--warning" id="due-soon" data-tooltip-variant="warning">
              <FontAwesomeIcon icon={faCircle} />
              <Tooltip anchorId="due-soon" content="Task Due Soon or Past Due" place="bottom" className="tooltip" />
            </span>
          )}
        </td>
        <td className="table__cell note__created">{createdString}</td>
        <td className="table__cell note__updated">{dueDateString}</td>
        <td className="table__cell note__title">{task.title}</td>
        <td className="table__cell note__username">{task.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else return null
}

const memoizedTask = memo(Task)

export default memoizedTask
