import useAuth from "../../hooks/useAuth"

const DashboardFooter = () => {
  const { username, status } = useAuth()

  const date = new Date()
  const today = new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(date)

  return (
    <footer className="dash-footer">
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
      <p>Refreshed: {today}</p>
    </footer>
  )
}
export default DashboardFooter
