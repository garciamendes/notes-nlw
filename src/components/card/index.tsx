import { truncate } from "../../utils"
import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { useContext } from "react"
import { NoteContext } from "../../context/noteContext"

export interface ICardProps {
  id: string
  created: Date
  content: string
}

export const Card = ({ id, content, created }: ICardProps) => {
  const { removeNote } = useContext(NoteContext)

  return (
    <Dialog.Root>
      <Dialog.Trigger className='text-left rounded-md p-5 space-y-3 bg-slate-800 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(created, { locale: ptBR, addSuffix: true })}
        </span>

        <p className="text-sm leading-6 text-slate-400 h-[190px]">
          {truncate(content, { lenght: 200 })}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/40">
          <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[640px] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition duration-0 hover:duration-500">
              <X className="size-5" />
            </Dialog.Close>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                {formatDistanceToNow(created, { locale: ptBR, addSuffix: true })}
              </span>

              <p className="text-sm leading-6 text-slate-400 h-[190px]">
                {content}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeNote(id)}
              className="w-full bg-slate-800 py-4 text-center text-sm text-slate-50 outline-none font-medium transition duration-0 group">
              Deseja <span className="text-red-400 group-hover:underline transition duration-0 group-hover:duration-500">apagar essa nota</span>?
            </button>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}