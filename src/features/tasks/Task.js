import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useGetTasksQuery } from "./tasksApiSlice"
import { memo } from "react"

const Task = ({ taskId }) => {
  const { task } = useGetTasksQuery("tasksList", {
    selectFromResult: ({ data }) => ({
      task: data?.entities[taskId],
    }),
  })

  const navigate = useNavigate()

  if (task) {
    const created = new Date(task.createdAt).toLocaleString("en-US", { day: "numeric", month: "2-digit", year: "2-digit" }) 
    const dueDate = new Date(task.dueDate).toLocaleString("en-US", { day: "numeric", month: "2-digit", year: "2-digit" }) 

    const handleEdit = () => navigate(`/dash/tasks/${taskId}`)

    return (
      <tr className="table__row">
        <td className="table__cell note__status">{task.completed ? <span className="note__status--completed">Completed</span> : <span className="note__status--open">Open</span>}</td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{dueDate}</td>
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
