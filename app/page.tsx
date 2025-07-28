import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-[--color-primary]">#힘이나는커피생활</h1>
      <Button>시작하기</Button>
    </div>
  )
}