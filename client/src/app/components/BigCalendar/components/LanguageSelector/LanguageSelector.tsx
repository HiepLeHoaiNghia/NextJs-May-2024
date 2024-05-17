'use client'

import { useTranslation } from 'react-i18next'

import { SelectItem } from '~/@shadcn/components/ui/select'
import { useCalendarContext } from '~/app/components/BigCalendar/context/BigCalendarContext'
import { type LanguageSelectItem, type LocaleCode } from '~/app/components/BigCalendar/types/languageConfig'
import { CustomSelect } from '~/app/components/CustomSelect/CustomSelect'

interface LanguageSelectorProps {
  className?: string
}

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { t } = useTranslation()

  const { currentLanguage, setCurrentLanguage, languageConfig } = useCalendarContext()

  const languageSelectItems: LanguageSelectItem[] =
    languageConfig?.[currentLanguage].translation.languageSelector.languageSelectorMenu || []

  const handleValueChange = async (value: string) => {
    setCurrentLanguage(value as LocaleCode)
  }

  return (
    <CustomSelect
      onValueChange={handleValueChange}
      value={currentLanguage}
      placeholder={t('languageSelector.selectorPlaceholder')}
      triggerClassName={className}
      contentClassName='max-h-[10rem]'
    >
      {languageSelectItems.map(({ localeCode, label, icon }: LanguageSelectItem) => (
        <SelectItem key={localeCode} value={localeCode}>
          {icon && <span className='mr-2'>{icon}</span>}
          {label}
        </SelectItem>
      ))}
    </CustomSelect>
  )
}

export default LanguageSelector
