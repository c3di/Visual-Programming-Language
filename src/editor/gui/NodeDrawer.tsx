import React, { useRef, useState } from "react";
import {
    ChakraProvider,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    List,
    ListItem,
    VStack,
    Portal,
    Icon,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { NodeData } from '../types/NodeType';

const nodes: Record<string, NodeData[]> = {
    Input: [
        { id: 'input1', name: 'Image Input', type: 'InputNode', parameters: [], outputs: {}, inputs: {} },
        { id: 'input2', name: 'CSV Input', type: 'InputNode', parameters: [], outputs: {}, inputs: {} }
    ],
    Effect: [
        { id: 'effect1', name: 'Blur', type: 'EffectNode', parameters: [], outputs: {}, inputs: {} },
        { id: 'effect2', name: 'Contrast', type: 'EffectNode', parameters: [], outputs: {}, inputs: {} }
    ]
};

function NodeDrawer({
    handleNodeDragStart,
    portalContainerRef,
}: {
    handleNodeDragStart: (
        event: React.DragEvent<HTMLLIElement>,
        nodeType: string,
        nodeData: NodeData
    ) => void;
    portalContainerRef: React.RefObject<HTMLDivElement>;
}) {
    return (
        <ChakraProvider>
            <Portal containerRef={portalContainerRef}>
                <Box p={4} width="250px" bg="gray.50" borderRight="1px solid #ccc" height="100%">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={Search2Icon} />
                        </InputLeftElement>
                        <Input placeholder="Search node" />
                    </InputGroup>
                    <VStack align="stretch" mt={4}>
                        {Object.entries(nodes).map(([category, items]) => (
                            <Box key={category}>
                                <Box fontWeight="bold" mb={2}>
                                    {category}
                                </Box>
                                <List spacing={2}>
                                    {items.map((node) => (
                                        <ListItem
                                            key={node.id}
                                            draggable
                                            onDragStart={(e) => handleNodeDragStart(e, node.type, node)}
                                            opacity={0.5}
                                            cursor="pointer"
                                            p={2}
                                            borderRadius="md"
                                            bg="gray.100"
                                            _hover={{ bg: 'gray.200' }}
                                        >
                                            {node.name}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Portal>
        </ChakraProvider>
    );
}

export default NodeDrawer;