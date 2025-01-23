import ReactDom from 'react-dom/client'
import App from './App'
import { AuthProvider } from './store/auth'

const root = ReactDom.createRoot(document.getElementById("root"))

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
        )