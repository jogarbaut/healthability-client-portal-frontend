import { useParams } from "react-router-dom"
import EditTaskForm from "./EditTaskForm"
import { useGetTasksQuery } from "./tasksApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"

const EditTask = () => {
  useTitle("Healthability: Edit Task")

  const { id } = useParams()

  const { username, isTherapist, isAdmin } = useAuth()

  const { task } = useGetTasksQuery("tasksList", {
    selectFromResult: ({ data }) => ({
      task: data?.entities[id],
    }),
  })

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!task || !users?.length) return <PulseLoader color={"#FFF"} />

  if (!isTherapist && !isAdmin) {
    if (task.username !== username) {
      return <p className="errmsg">No access</p>
    }
  }

  const content = <EditTaskForm task={task} users={users} />

  return content
}
export default EditTask
