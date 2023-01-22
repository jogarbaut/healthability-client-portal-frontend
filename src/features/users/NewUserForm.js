import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const FIRST_NAME_REGEX = /^[A-z]{2,20}$/
const LAST_NAME_REGEX = /^[A-z]{2,20}$/
const USER_REGEX = /^[A-z]{2,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation()

  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [validFirstName, setValidFirstName] = useState(false)
  const [lastName, setLastName] = useState("")
  const [validLastName, setValidLastName] = useState(false)
  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validConfirmPassword, setValidConfirmPassword] = useState(false)
  const [roles, setRoles] = useState(["Employee"])

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
    if (validPassword && confirmPassword === password) {
      setValidConfirmPassword(true)
    } else {
      setValidConfirmPassword(false)
    }
  }, [password, confirmPassword, validPassword])

  useEffect(() => {
    if (isSuccess) {
      setFirstName("")
      setLastName("")
      setUsername("")
      setPassword("")
      setConfirmPassword("")
      setRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, navigate])

  const onFirstNameChanged = (e) => setFirstName(e.target.value)
  const onLastNameChanged = (e) => setLastName(e.target.value)
  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)
  const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value)

  const onRolesChanged = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value)
    setRoles(values)
  }

  const canSave = [roles.length, validFirstName, validLastName, validUsername, validPassword, validConfirmPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ firstName, lastName, username, password, roles })
    }
  }

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"
  const validFirstNameClass = !validFirstName ? "form__input--incomplete" : ""
  const validLastNameClass = !validLastName ? "form__input--incomplete" : ""
  const validUserClass = !validUsername ? "form__input--incomplete" : ""
  const validPwdClass = !validPassword ? "form__input--incomplete" : ""
  const validConfirmPwdClass = !validConfirmPassword ? "form__input--incomplete" : ""
  const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : ""

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
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
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input className={`form__input ${validPwdClass}`} id="password" name="password" type="password" value={password} onChange={onPasswordChanged} />

        <label className="form__label" htmlFor="confirmPassword">
          Confirm Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input className={`form__input ${validConfirmPwdClass}`} id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={onConfirmPasswordChanged} />

        <label className="form__label" htmlFor="roles">
          Assign Roles:
        </label>
        <select id="roles" name="roles" className={`form__select ${validRolesClass}`} multiple={true} size="3" value={roles} onChange={onRolesChanged}>
          {options}
        </select>

        <div className="form__action-buttons">
          <button className="icon-button" title="Save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </form>
    </>
  )

  return content
}
export default NewUserForm
