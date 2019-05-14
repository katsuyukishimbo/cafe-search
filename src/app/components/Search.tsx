import React, { useState, useCallback } from 'react'
import { TextField, MenuItem } from '@material-ui/core'

interface SearchFormProps {
  label: string
  name: string
  defaultValue: string
  selectItems?: string[]
}

const SearchForm: React.FC<SearchFormProps> = ({ label, name, defaultValue, selectItems }) => {
  const [text, setText] = useState(defaultValue)

  const handleChangeText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  return (
    <>
      <TextField label={label} name={name} select value={text} onChange={handleChangeText} fullWidth={true}>
        {selectItems &&
          selectItems.map((item, index) => (
            <MenuItem key={`select-${name}-${index}`} value={item}>
              {item}
            </MenuItem>
          ))}
      </TextField>
      <input name={name} value={text} hidden readOnly />
    </>
  )
}

export default SearchForm
