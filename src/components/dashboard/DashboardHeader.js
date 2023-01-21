import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileCirclePlus, faFilePen, faUserGear, faUserPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from "react-router-dom"

import { useSendLogoutMutation } from "../../features/auth/authApiSlice"

import useAuth from "../../hooks/useAuth"

const DASH_REGEX = /^\/dash(\/)?$/
const TASKS_REGEX = /^\/dash\/tasks(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashboardHeader = () => {
  const { isTherapist, isAdmin } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onNewTaskClicked = () => navigate("/dash/tasks/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onTasksClicked = () => navigate("/dash/tasks")
  const onUsersClicked = () => navigate("/dash/users")

  let dashClass = null
  if (!DASH_REGEX.test(pathname) && !TASKS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    dashClass = "dash-header__container--small"
  }

  let newTaskButton = null
  if (TASKS_REGEX.test(pathname)) {
    newTaskButton = (
      <button className="icon-button" title="New Task" onClick={onNewTaskClicked}>
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    )
  }

  let newUserButton = null
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button className="icon-button" title="New User" onClick={onNewUserClicked}>
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }

  let userButton = null
  if (isTherapist || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      )
    }
  }

  let tasksButton = null
  if (!TASKS_REGEX.test(pathname) && pathname.includes("/dash")) {
    tasksButton = (
      <button className="icon-button" title="Tasks" onClick={onTasksClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    )
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const errClass = isError ? "errmsg" : "offscreen"

  let buttonContent
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>
  } else {
    buttonContent = (
      <>
        {newTaskButton}
        {newUserButton}
        {tasksButton}
        {userButton}
        {logoutButton}
      </>
    )
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
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
