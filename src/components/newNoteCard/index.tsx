import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, Mic, X } from 'lucide-react'
import { ChangeEvent, useContext, useState } from 'react'
import { toast } from 'sonner'
import { NoteContext } from '../../context/noteContext'

type typeAddNewNote = 'audio' | 'text' | ''

let speechRecognition: SpeechRecognition | null = null

export const NewNoteCard = () => {
  const [typeAddNew, setTypeAddNew] = useState<typeAddNewNote>('')
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const { addNote } = useContext(NoteContext)


  const handleSelectTypeAddNewNote = (type: typeAddNewNote) => {
    setTypeAddNew(type)
  }

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)

    if (event.target.value === '') {
      setTypeAddNew('')
    }
  }

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.info('Infelizmente seu navegador não suporta a API de gravação')
      setIsRecording(false)
      return
    }
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new SpeechRecognitionAPI()

    setIsRecording(true)
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  const handleStopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop()
      setIsRecording(false)
    }
  }

  const handleSaveNote = () => {
    if (!content.trim()) return toast.info('Digita a nota')

    addNote(content)
    setContent('')
    handleSelectTypeAddNewNote('')
    toast.success('Nota criada com sucesso')
  }

  const renderTypeAddNewNote = () => {
    if (typeAddNew === 'text') {
      return (
        <textarea
          autoFocus
          value={content}
          onChange={handleContentChange}
          className='bg-transparent leading-6 text-slate-400 resize-none flex-1 outline-none'
          placeholder='Ex: Essa é minha nota...'></textarea>
      )
    }

    if (typeAddNew === 'audio') {
      return (
        <div className='relative flex flex-col flex-1 gap-5 items-center mt-4'>
          <button onClick={() => handleSelectTypeAddNewNote('')} className='absolute left-0 flex gap-2'>
            <ArrowLeft className='text-slate-500' />
            <span className='text-slate-400'>Voltar</span>
          </button>

          <div className='relative leading-6 flex justify-center items-center'>
            {isRecording && <div className='absolute bg-red-500 p-6 rounded-full animate-ping'></div>}

            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className='p-6 rounded-full bg-slate-600 z-10'>
              <Mic className={`size-6 ${isRecording ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {isRecording ? (
            <span>Gravando (Clique p/ interromper)</span>
          ) : (
            <span>Clique no botão de gravar para iniciar a gravação</span>
          )}

          <div className='flex flex-1 w-full'>
            <textarea
              defaultValue={content}
              onChange={(event) => setContent(event.target.value)}
              className='w-full bg-transparent leading-6 text-slate-400 resize-none flex-1 outline-none'></textarea>
          </div>
        </div>
      )
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='flex flex-col text-left rounded-md p-5 gap-3 cursor-pointer relative bg-slate-700 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>

        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/40">
          <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[640px] w-full bg-slate-700 rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition duration-0 hover:duration-500">
              <X className="size-5" />
            </Dialog.Close>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {!typeAddNew && (
                <p className="text-sm leading-6 text-slate-400 h-[190px]">
                  Comece <button onClick={() => handleSelectTypeAddNewNote('audio')} className="text-lime-400 text-md hover:underline">gravando uma nota</button> em áudio ou se preferir <button onClick={() => handleSelectTypeAddNewNote('text')} className="text-lime-400 text-md hover:underline">utilize apenas texto.</button>
                </p>
              )}

              {renderTypeAddNewNote()}
            </div>

            {typeAddNew && (
              <button
                type="button"
                onClick={handleSaveNote}
                className={`w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium transition duration-0 hover:bg-lime-500 hover:duration-500 ${isRecording ? 'pointer-events-none opacity-45' : ''}`}>
                Adicionar nota
              </button>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}