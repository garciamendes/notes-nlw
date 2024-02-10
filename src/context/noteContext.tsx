import { ReactNode, createContext, useEffect, useState } from "react"
import { ICardProps } from "../components/card"
import { toast } from "sonner"

export interface INoteContext {
  notes: ICardProps[]
  addNote: (content: string) => void
  removeNote: (note_id: string) => void
}

export const NoteContext = createContext({} as INoteContext)

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<ICardProps[]>(() => {
    const notesSession = sessionStorage.getItem('notes')

    if (notesSession) {
      return JSON.parse(notesSession)
    }

    return []
  })

  useEffect(() => {
    sessionStorage.setItem('notes', JSON.stringify(notes))
  }, [notes.length])

  const addNote = (content: string) => {
    const note: ICardProps = {
      id: crypto.randomUUID(),
      content,
      created: new Date()
    }

    setNotes([note, ...notes])
  }

  const removeNote = (note_id: string) => {
    const noteToRemove = notes.find(note => note.id === note_id)

    if (!noteToRemove) return toast.info('Nota não existe')

    const newArray = notes.filter(({ id }) => id !== noteToRemove.id)
    setNotes(newArray)
  }

  return (
    <NoteContext.Provider value={{
      notes,

      addNote,
      removeNote
    }}>
      {children}
    </NoteContext.Provider>
  )
}