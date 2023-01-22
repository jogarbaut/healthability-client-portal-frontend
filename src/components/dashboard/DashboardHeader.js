import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileCirclePlus, faFile, faUserGear, faUserPlus, faRightFromBracket, faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link } from "react-router-dom"
import { useSendLogoutMutation } from "../../features/auth/authApiSlice"
import useAuth from "../../hooks/useAuth"
import { Tooltip } from "react-tooltip"
import BounceLoader from "react-spinners/BounceLoader"

const DashboardHeader = () => {
  const { isTherapist, isAdmin } = useAuth()

  const navigate = useNavigate()

  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onHomeClicked = () => navigate("/dash")
  const onNewTaskClicked = () => navigate("/dash/tasks/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onTasksClicked = () => navigate("/dash/tasks")
  const onUsersClicked = () => navigate("/dash/users")

  // Home button
  let homeButton = (
    <button className="icon-button" title="Home" onClick={onHomeClicked} id="home" data-tooltip-variant="warning">
      <Tooltip anchorId="home" content="Home" place="bottom" className="tooltip" />
      <FontAwesomeIcon icon={faHouse} />
    </button>
  )

  // New task button
  let newTaskButton = null
  if (isTherapist || isAdmin) {
    newTaskButton = (
      <button className="icon-button" title="New Task" onClick={onNewTaskClicked} id="new-task" data-tooltip-variant="warning">
        <Tooltip anchorId="new-task" content="New Task" place="bottom" className="tooltip" />
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    )
  }

  // View task button
  let tasksButton = (
    <button className="icon-button" title="Tasks" onClick={onTasksClicked} id="view-tasks" data-tooltip-variant="warning">
      <Tooltip anchorId="view-tasks" content="View Tasks" place="bottom" className="tooltip" />
      <FontAwesomeIcon icon={faFile} />
    </button>
  )

  // New user button
  let newUserButton = null
  if (isTherapist || isAdmin) {
    newUserButton = (
      <button className="icon-button" title="View Tasks" onClick={onNewUserClicked} id="new-user" data-tooltip-variant="warning">
        <Tooltip anchorId="new-user" content="Add New User" place="bottom" className="tooltip" />
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }

  // User settings button
  let userButton = null
  if (isTherapist || isAdmin) {
    userButton = (
      <button className="icon-button" title="Users" onClick={onUsersClicked} id="user-settings" data-tooltip-variant="warning">
        <Tooltip anchorId="user-settings" content="User Settings" place="bottom" className="tooltip" />
        <FontAwesomeIcon icon={faUserGear} />
      </button>
    )
  }

  // Logout button
  let logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout} id="logout" data-tooltip-variant="warning">
      <Tooltip anchorId="logout" content="Logout" place="bottom" className="tooltip" />
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent
  if (isLoading) {
    buttonContent = <BounceLoader color="#CD760F" />
  } else {
    buttonContent = (
      <>
        {homeButton}
        {newTaskButton}
        {tasksButton}
        {newUserButton}
        {userButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className="dash-header__container">
          <Link to="/dash">
            <h1 className="dash-header__title">Healthability Client Portal</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  )

  return content
}
export default DashboardHeader
