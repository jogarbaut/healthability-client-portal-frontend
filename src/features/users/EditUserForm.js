import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const FIRST_NAME_REGEX = /^[A-z]{2,20}$/
const LAST_NAME_REGEX = /^[A-z]{2,20}$/
const USER_REGEX = /^[A-z]{2,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {
  // Update user
  const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation()

  // Delete user
  const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(user.firstName)
  const [validFirstName, setValidFirstName] = useState(false)
  const [lastName, setLastName] = useState(user.lastName)
  const [validLastName, setValidLastName] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validConfirmPassword, setValidConfirmPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)

  useEffect(() => {
    setValidFirstName(FIRST_NAME_REGEX.test(firstName))
  }, [firstName])

  useEffect(() => {
    setValidLastName(LAST_NAME_REGEX.test(lastName))
  }, [lastName])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (password && validPassword && confirmPassword === password){
      setValidConfirmPassword(true)
    } else {
      setValidConfirmPassword(false)
    }
  }, [password, confirmPassword, validPassword])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setFirstName("")
      setLastName("")
      setUsername("")
      setPassword("")
      setConfirmPassword("")
      setRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onFirstNameChanged = (e) => setFirstName(e.target.value)
  const onLastNameChanged = (e) => setLastName(e.target.value)
  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value)

  const onRolesChanged = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value)
    setRoles(values)
  }

  const onActiveChanged = () => setActive((prev) => !prev)

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, firstName, lastName, username, password, roles, active })
    } else {
      await updateUser({ id: user.id, firstName, lastName, username, roles, active })
    }
  }

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id })
  }

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    )
  })

  let canSave
  if (password) {
    canSave = [roles.length, validFirstName, validLastName, validUsername, validPassword, validConfirmPassword].every(Boolean) && !isLoading
  } else {
    canSave = [roles.length, validFirstName, validLastName, validUsername].every(Boolean) && !isLoading
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen"
  const validFirstNameClass = !validFirstName ? "form__input--incomplete" : ""
  const validLastNameClass = !validLastName ? "form__input--incomplete" : ""
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass = password && !validPassword ? "form__input--incomplete" : ""
  const validConfirmPwdClass = password && !validConfirmPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : ""

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
        </div>

        <label className="form__label" htmlFor="firstName">
          First Name: <span className="nowrap">[2-20 letters]</span>
        </label>
        <input className={`form__input ${validFirstNameClass}`} id="firstName" name="firstName" type="text" autoComplete="off" value={firstName} onChange={onFirstNameChanged} />

        <label className="form__label" htmlFor="lastName">
          Last Name: <span className="nowrap">[2-20 letters]</span>
        </label>
        <input className={`form__input ${validLastNameClass}`} id="lastName" name="lastName" type="text" autoComplete="off" value={lastName} onChange={onLastNameChanged} />

        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[2-20 letters]</span>
        </label>
        <input className={`form__input ${validUserClass}`} id="username" name="username" type="text" autoComplete="off" value={username} onChange={onUsernameChanged} />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input className={`form__input ${validPwdClass}`} id="password" name="password" type="password" value={password} onChange={onPasswordChanged} />

        <label className="form__label" htmlFor="confirmPassword">
          Confirm Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input className={`form__input ${validConfirmPwdClass}`} id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={onConfirmPasswordChanged} />

        <label className="form__label form__checkbox-container" htmlFor="user-active">
          Active:
          <input className="form__checkbox" id="user-active" name="user-active" type="checkbox" checked={active} onChange={onActiveChanged} />
        </label>

        <label className="form__label" htmlFor="roles">
          Assigned Roles:
        </label>
        <select id="roles" name="roles" className={`form__select ${validRolesClass}`} multiple={true} size="3" value={roles} onChange={onRolesChanged}>
          {options}
        </select>

        <div className="form__action-buttons">
            <button className="icon-button" title="Save" onClick={onSaveUserClicked} disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="Delete" onClick={onDeleteUserClicked}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
      </form>
    </>
  )
  return content
}
export default EditUserForm