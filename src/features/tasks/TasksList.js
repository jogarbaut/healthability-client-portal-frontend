import { useState } from "react"
import { useGetTasksQuery } from "./tasksApiSlice"
import Task from "./Task"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery } from "../users/usersApiSlice"
import BounceLoader from "react-spinners/BounceLoader"

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

  // Get all users
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  // Create state for select input
  const [selectedUsername, setSelectedUserName] = useState("")
  const onSelectedUserUsernameChanged = (e) => setSelectedUserName(e.target.value)

  // Set options for select input
  let options
  if (isTherapist || isAdmin) {
    options = users.map((user) => {
      return (
        <option key={user.id} value={user.username}>
          {" "}
          {user.username}
        </option>
      )
    })
  } else {
    options = null
  }


  let select
  if (isTherapist || isAdmin) {
    select = (
      <select id="username" name="username" className="form__select" value={selectedUsername} onChange={onSelectedUserUsernameChanged}>
        <option key={0} value="">
          Select A User
        </option>
        {options}
      </select>
    )
  } else {
    select = null
  }

  let content

  if (isLoading) content = <BounceLoader color="#CD760F" />

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = tasks

    let filteredIds
    if (isTherapist || isAdmin) {
      // Set filtered tasks to the selected user
      filteredIds = ids.filter((taskId) => entities[taskId].username === selectedUsername)
    } else {
      filteredIds = ids.filter((taskId) => entities[taskId].username === username)
    }

    let tableContent
    if (filteredIds.length > 0) {
      tableContent = filteredIds?.length && filteredIds.map((taskId) => <Task key={taskId} taskId={taskId} />)
    } else {
      tableContent = <tr></tr>
    }

    content = (
      <>
        <h2 className="page-title">Client Tasks</h2>
        <div className="dash-select">{select}</div>
        {((selectedUsername) || (!isTherapist || !isAdmin)) && (
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
        )}
      </>
    )
  }

  return content
}
export default TasksList
