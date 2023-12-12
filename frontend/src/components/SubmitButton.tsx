import { Button, Container } from "@chakra-ui/react"
import { useState } from "react"
import { useMediaStore, useSearchStore } from "../state"

function SubmitButton() {

    const [isLoading, setLoading] = useState(false)

    const prompt = useSearchStore((state) => state.prompt)
    const size = useSearchStore((state) => state.size)

    const addMedia = useMediaStore((state) => state.addMedia)

    return (
        <Container minW={{ base: '100%', sm: 'auto' }}>
            <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isDisabled={!prompt}
                isLoading={isLoading}
                onClick={async () => {
                    setLoading(true)
                    const data = await (await fetch(`http://localhost:3000/create`, {
                        method: 'POST',
                        body: JSON.stringify({
                            "prompt": prompt,
                            "size": size
                        })
                    })).json()
                    addMedia({
                        prompt: prompt!,
                        size: size,
                        id: data.id,
                        state: data.status
                    })
                    setLoading(false)
                }}
            >
                Draw!
            </Button>
        </Container>
    )

}

export { SubmitButton }
