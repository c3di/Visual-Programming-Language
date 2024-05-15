import { ChakraProvider, Box, Input, InputGroup, InputLeftElement, List, ListItem, VStack, Portal, Icon, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { nodeConfigRegistry } from '../extension';
import { NodeConfig } from '../types';

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
        <ChakraProvider>
            <Portal containerRef={portalContainerRef}>
                <Box p={4} width="300px" bg="gray.50" borderRight="1px solid #ccc" height="100%">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={Search2Icon} />
                        </InputLeftElement>
                        <Input placeholder="Search node" />
                    </InputGroup>
                    <Tabs orientation="vertical" mt={4}>
                        <TabList>
                            {filteredNodeConfigs.map(([category]) => (
                                <Tab key={category}>{category}</Tab>
                            ))}
                        </TabList>
                        <TabPanels>
                            {filteredNodeConfigs.map(([category, config]) => {
                                console.log('Category:', category);
                                console.log('Config Nodes:', config.nodes);
                                return (
                                    <TabPanel key={category}>
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
                                                            {typedNodeConfig.title}
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
            </Portal>
        </ChakraProvider>
    );
}

export default NodeDrawer;