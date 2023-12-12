import { Flex, Heading, VStack } from '@chakra-ui/react'
import { SearchBar } from './components/SearchBar'
import { SubmitButton } from './components/SubmitButton'
import { MediaGallery } from './components/MediaGallery'

function App() {

  return (
    <Flex justifyContent="center" alignItems="center" p='4em'>
      <VStack width='100%' spacing='2em'>
        <Heading size='3xl'>Axolotl</Heading>
        <SearchBar/>
        <SubmitButton/>
        <MediaGallery/>
      </VStack>
    </Flex>
  )
}

export default App
