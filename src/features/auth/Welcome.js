import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {
  const { username, isTherapist, isAdmin } = useAuth()

  const content = (
    <section className="welcome">
      <h1>Welcome {username}!</h1>
      <p>
        <Link to="/dash/tasks">&#10003; View Client Tasks</Link>
      </p>
      {(isTherapist || isAdmin) && (
        <>
          <p>
            <Link to="/dash/tasks/new">&#10003; Assign New Task To Clients</Link>
          </p>
          <p>
            <Link to="/dash/users">&#10003; View User Settings</Link>
          </p>
          <p>
            <Link to="/dash/users/new">&#10003; Add New User</Link>
          </p>
        </>
      )}
    </section>
  )

  return content
}
export default Welcome
