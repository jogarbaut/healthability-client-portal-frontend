import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import BounceLoader from "react-spinners/BounceLoader"
import { Tooltip } from "react-tooltip"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [persist, setPersist] = usePersist()
  const [demoType, setDemoType] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername("")
      setPassword("")
      navigate("/dash")
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response")
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password")
      } else if (err.status === 401) {
        setErrMsg("Unauthorized")
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist((prev) => !prev)

  const onDemoTypeChanged = (e) => {
    setDemoType(e.target.value)
    setUsername(`Demo${e.target.value}`)
    setPassword("!demo123")
  }

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) return <BounceLoader color="#CD760F" />

  const today = new Date()

  const content = (
    <section className="public">
      <header>
        <h1>Healthability Client Portal</h1>
      </header>
      <main className="login">
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <h2 className="page-title">Login</h2>
            <label htmlFor="demo-type">Select Demo Type:</label>
            <select id="demo-type" name="demo-type" className="form__select" onChange={onDemoTypeChanged}>
              <option value={""} hidden>
                Demo Type
              </option>
              <option value={"Admin"}>Admin</option>
              <option value={"Therapist"}>Therapist</option>
              <option value={"Client"}>Client</option>
            </select>
            <label htmlFor="username">Username:</label>
            <input className="form__input" type="text" id="username" ref={userRef} value={username} onChange={handleUserInput} autoComplete="off" required readOnly data-tooltip-variant="warning" />
            <Tooltip anchorId="username" content="For demo purposes, please select demo type above" place="bottom" className="tooltip" />

            <label htmlFor="password">Password:</label>
            <input className="form__input" type="password" id="password" onChange={handlePwdInput} value={password} required readOnly data-tooltip-variant="warning" />
            <Tooltip anchorId="password" content="For demo purposes, please select demo type above" place="bottom" className="tooltip" />

            {demoType ? <button className="form__submit-button">Continue as {demoType}</button> : <></>}
            <label htmlFor="persist" className="form__persist">
              <input type="checkbox" className="form__checkbox" id="persist" onChange={handleToggle} checked={persist} data-tooltip-variant="warning" />
              <Tooltip anchorId="persist" content="Toggle to persist your login" place="bottom" className="tooltip" />
              Trust This Device
            </label>
            <p ref={errRef} className={errClass} aria-live="assertive">
              {errMsg}
            </p>
          </form>
        </div>
      </main>
      <footer>
        <p>Copyright &copy; {today.getFullYear()} Jomel Bautista</p>
      </footer>
    </section>
  )

  return content
}
export default Login
