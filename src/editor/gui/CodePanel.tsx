import { Highlight, themes } from 'prism-react-renderer';
import { Box, Button, useClipboard } from '@chakra-ui/react'
import { GenResult } from '../types';

const CodePanel = ({ code }: { code: GenResult | undefined }) => {
    const { onCopy, hasCopied } = useClipboard(code?.code!)

    return (
        <Box
            zIndex={5}
            p={4}
            fontSize="sm"
            backgroundColor="#011627"
            overflow="auto"
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
        >
            <Button
                onClick={onCopy}
                size="sm"
                position="absolute"
                textTransform="uppercase"
                colorScheme="teal"
                fontSize="xs"
                height="24px"
                top={4}
                right="1.25em"
            >
                {hasCopied ? 'copied' : 'copy'}
            </Button>
            <Highlight
                code={code?.code || '// Formatting code… please wait ✨'}
                language="python"
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </Box>
    )
}


export default CodePanel;
