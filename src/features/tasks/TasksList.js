import { useGetTasksQuery } from "./tasksApiSlice"
import Task from "./Task"
import useAuth from "../../hooks/useAuth"

const TasksList = () => {
  const { username, isTherapist, isAdmin } = useAuth()

  const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTasksQuery("tasksList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = tasks

    let filteredIds
    if (isTherapist || isAdmin) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter((taskId) => (entities[taskId].username === username))
    }

    const tableContent = ids?.length && filteredIds.map((taskId) => <Task key={taskId} taskId={taskId} />)

    content = (
      <>
      <h2 className="page-title">Client Tasks</h2>
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note__status">
              Status
            </th>
            <th scope="col" className="table__th note__created">
              Created
            </th>
            <th scope="col" className="table__th note__updated">
              Due Date
            </th>
            <th scope="col" className="table__th note__title">
              Title
            </th>
            <th scope="col" className="table__th note__username">
              Assigned To
            </th>
            <th scope="col" className="table__th note__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
      </>
    )
  }

  return content
}
export default TasksList
