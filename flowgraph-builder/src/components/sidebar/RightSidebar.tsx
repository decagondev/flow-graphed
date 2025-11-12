import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PropertiesPanel } from './PropertiesPanel'

export const RightSidebar: React.FC = () => {
  return (
    <Sheet defaultOpen>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Properties</SheetTitle>
        </SheetHeader>
        <PropertiesPanel />
      </SheetContent>
    </Sheet>
  )
}

