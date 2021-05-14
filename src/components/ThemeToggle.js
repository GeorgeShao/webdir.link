import React from 'react'
import { Button, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode} size="lg" colorScheme="purple" marginRight="2" marginTop="2">
        {colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
      </Button>
    </header>
  )
}

export default ThemeToggle;
