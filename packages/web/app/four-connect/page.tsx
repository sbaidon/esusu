import { PlayerPickerForm } from '@/components/player-picker-form'

export default function FourConnectPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-10">Four Connect</h1>
      <PlayerPickerForm />
    </div>
  )
}
