export enum DialogType {
  createEvent,
  showEvent,
  editEvent
}

export enum DialogAction {
  close,
  open
}
export interface DialogState {
  dialogMode: DialogAction
  dialogType: DialogType | null
}
