import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {
  const { username, isTherapist, isAdmin } = useAuth()

  const content = (
    <section className="welcome">
      <h1>Welcome {username}!</h1>

      <Link to="/dash/tasks">
        <button className="dash-button">View Client Tasks</button>
      </Link>

      {(isTherapist || isAdmin) && (
        <>
          <Link to="/dash/tasks/new">
            <button className="dash-button">Assign New Task To Clients</button>
          </Link>

          <Link to="/dash/users">
            <button className="dash-button">View User Settings</button>
          </Link>

          <Link to="/dash/users/new">
            <button className="dash-button"> Add New User</button>
          </Link>
        </>
      )}
    </section>
  )

  return content
}
export default Welcome
