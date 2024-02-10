import { Home } from './containers/home'
import { Toaster } from 'sonner'
import { NoteProvider } from './context/noteContext'

export const App = () => {

  return (
    <NoteProvider>
      <Toaster richColors />
      <Home />
    </NoteProvider>
  )
}
