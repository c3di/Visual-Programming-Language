import React, { useContext } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { ChakraProvider, Box, Button, useClipboard } from '@chakra-ui/react'
import CodeContext from './CodeContext';

const CodePanel = () => {
    const code = useContext(CodeContext);
    console.log("CodePanel code:", code);
    const { onCopy, hasCopied } = useClipboard(code!)

    return (
        <ChakraProvider>
            <Box
                p={4}
                fontSize="sm"
                bg="gray.50"
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
                    code={code || '//Getting code… please wait ✨'}
                    theme={themes.nightOwlLight}
                    language="python"
                >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className={className} style={{ ...style, backgroundColor: 'transparent' }}>
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
        </ChakraProvider>
    )
}


export default CodePanel;


