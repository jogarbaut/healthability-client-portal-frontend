import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from "jwt-decode"

const useAuth = () => {
  const token = useSelector(selectCurrentToken)
  let isTherapist = false
  let isAdmin = false
  let status = "Client"

  if (token) {
    const decoded = jwtDecode(token)
    const { firstName, lastName, username, roles } = decoded.UserInfo

    isTherapist = roles.includes("Therapist")
    isAdmin = roles.includes("Admin")

    if (isTherapist) status = "Therapist"
    if (isAdmin) status = "Admin"

    return { firstName, lastName, username, roles, status, isTherapist, isAdmin }
  }

  return { firstName: "", lastName: "", username: "", roles: [], isTherapist, isAdmin, status }
}
export default useAuth
