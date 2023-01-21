import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import PublicLayout from "./components/visible_public/PublicLayout"
import DashboardLayout from "./components/dashboard/DashboardLayout"
import Login from "./features/auth/Login"
import Welcome from "./features/auth/Welcome"
import TasksList from "./features/tasks/TasksList"
import UsersList from "./features/users/UsersList"
import NewUserForm from "./features/users/NewUserForm"
import EditUser from "./features/users/EditUser"
import NewTask from "./features/tasks/NewTask"
import EditTask from "./features/tasks/EditTask"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

function App() {
  useTitle('Healthability')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<PublicLayout />} />
        <Route path="login" element={<Login />} />
        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              {/* Protected 'dash' parent route */}
              <Route path="dash" element={<DashboardLayout />}>
                <Route index element={<Welcome />} />
                <Route element={<RequireAuth allowedRoles={[ROLES.Therapist, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
                <Route path="tasks">
                  <Route index element={<TasksList />} />
                  <Route path=":id" element={<EditTask />} />
                  <Route path="new" element={<NewTask />} />
                </Route>
              </Route>
              {/* End protected 'dash' parent route */}
            </Route>
          </Route>
        </Route>
        {/* Protected routes */}
      </Route>
    </Routes>
  )
}

export default App
