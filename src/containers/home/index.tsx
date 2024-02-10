import { ChangeEvent, useContext, useState } from "react"
import { Card } from "../../components/card"
import { NewNoteCard } from "../../components/newNoteCard"
import { NoteContext } from "../../context/noteContext"

export const Home = () => {
  const { notes } = useContext(NoteContext)

  const [search, setSearch] = useState('')

  const handleSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl my-12- space-y-6 mt-6 px-5">
      <form className="w-full">
        <input
          type="text"
          onChange={handleSearchFilter}
          className="bg-transparent border-0 outline-none text-3xl font-semibold tracking-tight placeholder:text-slate-500"
          placeholder="Busque em suas notas..." />
      </form>

      <div className="h-px bg-slate-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]">
        <NewNoteCard />

        {filteredNotes.map(note => (
          <Card
            key={note.id}
            id={note.id}
            content={note.content}
            created={note.created} />
        ))}
      </div>
    </div>
  )
}