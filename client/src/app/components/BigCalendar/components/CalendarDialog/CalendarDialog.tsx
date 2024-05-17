'use client'

import { useTranslation } from 'react-i18next'

import { Button } from '~/@shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/@shadcn/components/ui/dialog'
import CalendarForm from '~/app/components/BigCalendar/components/CalendarForm/CalendarForm'
import {
  type BigCalendarContextType,
  useCalendarContext
} from '~/app/components/BigCalendar/context/BigCalendarContext'

import { DialogAction, DialogType } from '../../types/dialog.type'

export type CalendarDialogProps = Partial<BigCalendarContextType> & {
  className?: string
}

const CalendarDialog = (props: CalendarDialogProps) => {
  const context = useCalendarContext()

  const { t } = useTranslation()

  const {
    onCreateEvent = context.onCreateEvent,
    onEditEvent = context.onEditEvent,
    onDeleteEvent = context.onDeleteEvent,
    selectedEvent = context.selectedEvent,
    dialogState = context.dialogState,
    setDialogState = context.setDialogState,
    className = 'max-w-xl'
  } = props

  const isCreateEvent = dialogState.dialogType === DialogType.createEvent

  const handleSaveEvent = async () => {
    if (!selectedEvent || !onCreateEvent || !onEditEvent) {
      return
    }
    if (isCreateEvent) {
      await onCreateEvent(selectedEvent)
    } else {
      await onEditEvent(selectedEvent)
    }
    setDialogState({ dialogMode: DialogAction.close, dialogType: null })
  }

  const toggleEditMode = () => {
    setDialogState({
      ...dialogState,
      dialogType: dialogState.dialogType === DialogType.showEvent ? DialogType.editEvent : DialogType.showEvent
    })
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id || !onDeleteEvent) {
      return
    }
    await onDeleteEvent(selectedEvent.id)
    setDialogState({ dialogMode: DialogAction.close, dialogType: null })
  }

  return (
    <Dialog
      open={dialogState.dialogMode === DialogAction.open}
      onOpenChange={(open) =>
        setDialogState({
          dialogMode: open ? DialogAction.open : DialogAction.close,
          dialogType: dialogState.dialogType
        })
      }
    >
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>
            {isCreateEvent ? t('calendarDialog.createEventTitle') : t('calendarDialog.editEventTitle')}
          </DialogTitle>
          <DialogDescription>
            {isCreateEvent ? t('calendarDialog.createEventDescription') : t('calendarDialog.editEventDescription')}
          </DialogDescription>
        </DialogHeader>
        <CalendarForm />
        <DialogFooter>
          <div className='flex flex-1 justify-between gap-4'>
            {dialogState.dialogType === DialogType.showEvent ? (
              <>
                <Button className='flex-1' onClick={handleDeleteEvent} type='button'>
                  {t('calendarDialog.deleteBtn')}
                </Button>
                <Button className='flex-1' onClick={toggleEditMode} type='button'>
                  {t('calendarDialog.enableEditModeBtn')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className='flex-1'
                  onClick={() => setDialogState({ dialogMode: DialogAction.close, dialogType: dialogState.dialogType })}
                  type='button'
                >
                  {t('calendarDialog.cancelBtn')}
                </Button>
                <Button className='flex-1' onClick={handleSaveEvent} type='button'>
                  {t('calendarDialog.saveBtn')}
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarDialog
