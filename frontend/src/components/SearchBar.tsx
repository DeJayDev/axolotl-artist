import { Collapse, Container, FormControl, FormHelperText, FormLabel, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiArrowDown, HiArrowLeft, HiSearch } from "react-icons/hi";
import { useSearchStore } from "../state";

function SearchBar() {

    const [settingsOpen, setSettingsOpen] = useState(false)

    const setPrompt = useSearchStore((state) => state.setPrompt)
    const setSize = useSearchStore((state) => state.setSize)

    return (
        <Container>
            <InputGroup>
                <InputLeftElement height='100%' pointerEvents='none'>
                    <Icon 
                        as={HiSearch} 
                        fontSize='32px'
                        pl='4px'
                        opacity='0.3'
                        color='gray.300'/>
                </InputLeftElement>
                <Input
                    placeholder="What will you make next?"
                    borderBottomRadius='0px'//{settingsOpen ? '0px' : 'md'}
                    boxShadow='xl'
                    size='lg'
                    onChange={(e) => setPrompt(e.target.value)}/>
                <InputRightElement height='100%' cursor='pointer' mr='4px'>
                    <IconButton
                        aria-label="Click to open settings"
                        variant='ghost'
                        icon={settingsOpen ? <HiArrowLeft/> : <HiArrowDown/>}
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        fontSize='28px'
                        color='gray.300'
                    />
                </InputRightElement>
            </InputGroup>
            <Collapse in={settingsOpen}>
                <HStack
                    justifyContent='center'
                    padding='8px' 
                    borderTop='none'
                    borderWidth='1px'
                    borderBottomLeftRadius='md'
                    borderBottomRightRadius='md'>
                        <FormControl>
                            <FormLabel>Size</FormLabel>
                            <NumberInput defaultValue={512} min={8} max={4096}>
                                <NumberInputField
                                    borderTop='1px'
                                    borderTopColor={'var(--chakra-colors-chakra-border-color)'} /* I have no clue why this needed to be done. */
                                    onChange={(e) => setSize(e.target.valueAsNumber)}
                                />
                            </NumberInput>
                            <FormHelperText>
                                Your image will be the same height and width as this value!
                            </FormHelperText>
                        </FormControl>
                </HStack>
            </Collapse>
        </Container>
    )

}

export { SearchBar };
