import NewTaskForm from "./NewTaskForm"
import { useGetUsersQuery } from "../users/usersApiSlice"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"

const NewTask = () => {
  useTitle("Healthability: New Task")

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  })

  if (!users?.length) return <PulseLoader color={"#FFF"} />

  const content = <NewTaskForm users={users} />

  return content
}
export default NewTask
