import type { Media } from "../types/media"
import { useMediaStore } from "../state"
import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react"
import { useEffect, useState } from "react"

function MediaGallery() {

    const mediaStore = useMediaStore()

/*     const media: Media[] = [
        {
            id: "1",
            size: 1024,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "2",
            size: 2048,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "4",
            size: 512,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "3",
            size: 256,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "5",
            size: 256,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "6",
            size: 128,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "7",
            size: 512,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "8",
            size: 512,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
        {
            id: "9",
            size: 512,
            prompt: "A cute baby sea otter",
            state: "IN_PROGRESS"
        },
    ]
 */
    useEffect(() => {
        const id = setInterval(async () => {
            const newMedia = await updateMedia(mediaStore.media)
            mediaStore.setMedia(newMedia);
        }, 1.5 * 1000);

        return () => clearInterval(id);
    }, [mediaStore.media])

    return (
        <SimpleGrid columns={5} spacing={4}>
            {mediaStore.media.map((media) => (
                <MediaGalleryPhoto key={media.id} media={media} />   
            ))}
        </SimpleGrid>
    )
}

async function updateMedia(media: Media[]) { 
    const updatedMediaList = await Promise.all(
        media.map(async (mediaItem) => {
            if (mediaItem.state === "IN_PROGRESS" || mediaItem.state === "IN_QUEUE") {
                const data = await (await fetch("http://localhost:3000/status/" + mediaItem.id)).json();

                if (data.status === "COMPLETED") {
                    return {
                        ...mediaItem,
                        url: 'http://localhost:3000' + data.url, // data.url has a slash in it already, so its ok.
                        state: data.status,
                    };
                }
            }
    
          return mediaItem;
        })
    );
    
    return updatedMediaList;
}

function MediaGalleryPhoto(props: { media: Media }) {
    
    const [isShowingDetails, setShowingDetails] = useState(false);

    return (
        <Box 
            onMouseEnter={() => setShowingDetails(true)}
            onMouseLeave={() => setShowingDetails(false)}>
            <figure style={{margin: 0, position: "relative"}}>
                <Image
                    fallbackSrc={"https://placehold.co/" + props.media.size + "?text=Loading..."}
                    bgSize={props.media.size + "px"}
                    width="100%"
                    height="auto"
                    src={props.media.url} 
                    alt={props.media.prompt} />
                {isShowingDetails && (
                    <Heading
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        p={4}
                        backgroundColor="rgba(0, 0, 0, 0.5)"
                        textAlign="center"
                        fontSize="sm">
                            {props.media.prompt}
                    </Heading>
                )}
            </figure>
        </Box>
    )
}

export { MediaGallery }