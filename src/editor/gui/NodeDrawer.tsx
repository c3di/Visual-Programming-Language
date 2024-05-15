import { ChakraProvider, Box, Input, InputGroup, InputLeftElement, List, ListItem, VStack, Portal, Icon, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { nodeConfigRegistry } from '../extension';
import { NodeConfig } from '../types';
import React, { useState } from 'react';

function NodeDrawer({
    handleNodeDragStart,
    portalContainerRef,
}: {
    handleNodeDragStart: (
        event: React.DragEvent<HTMLLIElement>,
        nodeType: string,
        nodeData: NodeConfig
    ) => void;
    portalContainerRef: React.RefObject<HTMLDivElement>;
}) {
    const allNodeConfigs = nodeConfigRegistry.getAllNodeConfigs();
    const filteredNodeConfigs = Object.entries(allNodeConfigs).filter(
        ([, config]) => Object.keys(config.nodes ?? {}).length > 0
    );

    console.log('All Node Configs:', filteredNodeConfigs);


    return (
        <Box p={4} width="300px" bg="gray.50" borderRight="1px solid #ccc" height="100%" flexDirection="column">
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <Icon as={Search2Icon} />
                </InputLeftElement>
                <Input placeholder="Search node" />
            </InputGroup>
            <Tabs isFitted variant='soft-rounded' orientation="vertical" mt={8}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    height: 'calc(100% - 60px)',
                }}>
                <TabList sx={{
                    width: '50px',
                    height: '100%',
                }}
                >
                    {filteredNodeConfigs.map(([category]) => (
                        <Tab fontSize='xs' key={category}>{category}</Tab>
                    ))}
                </TabList>
                <TabPanels
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                    }}>
                    {filteredNodeConfigs.map(([category, config]) => {
                        console.log('Category:', category);
                        console.log('Config Nodes:', config.nodes);
                        return (
                            <TabPanel key={category} mt={2}>
                                <VStack align="stretch">
                                    <List spacing={2}>
                                        {Object.values(config.nodes ?? {}).map((nodeConfig) => {
                                            const typedNodeConfig = nodeConfig as NodeConfig;
                                            console.log('Node Config:', typedNodeConfig); // Log each node configuration
                                            return (
                                                <ListItem
                                                    key={typedNodeConfig.id}
                                                    draggable
                                                    onDragStart={(e) =>
                                                        handleNodeDragStart(e, typedNodeConfig.type, typedNodeConfig)
                                                    }
                                                    opacity={0.5}
                                                    cursor="pointer"
                                                    p={2}
                                                    borderRadius="md"
                                                    bg="gray.100"
                                                    _hover={{ bg: 'gray.200' }}
                                                >
                                                    {typedNodeConfig.title || typedNodeConfig.name}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </VStack>
                            </TabPanel>
                        );
                    })}
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default NodeDrawer;