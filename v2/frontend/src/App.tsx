import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { ThemeProvider } from "./components/ui/theme-provider"
import { UserContextProvider } from "./context/UserContext"
import { Toaster } from "./components/ui/sonner"


function App() {
  return (
    <UserContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
            <Toaster />
    </UserContextProvider>

  )
}

export default App