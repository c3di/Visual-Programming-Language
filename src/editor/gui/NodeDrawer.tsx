import React, { useState, useEffect } from 'react';
import {
    Box, Input, InputGroup, InputLeftElement, List, ListItem, VStack, Text, Icon, Tabs, TabList, TabPanels, Tab, TabPanel, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
} from '@chakra-ui/react';
import { Search2Icon, ChevronRightIcon } from '@chakra-ui/icons';
import { nodeConfigRegistry } from '../extension';
import { NodeConfig, NodePackage } from '../types';

function NodeDrawer({
    handleNodeDragStart,
}: {
    handleNodeDragStart: (
        event: React.DragEvent<HTMLLIElement>,
        nodeType: string,
        nodeData: NodeConfig
    ) => void;
}) {
    const allNodeConfigs = nodeConfigRegistry.getAllNodeConfigs();
    const filteredNodeConfigs = Object.entries(allNodeConfigs).filter(
        ([, config]) => Object.keys(config.nodes ?? {}).length > 0
    );

    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTab, setCurrentTab] = useState<string | null>(filteredNodeConfigs.length ? filteredNodeConfigs[0][0] : null);

    useEffect(() => {
        if (currentTab) {
            setCurrentPath([currentTab]);
        }
    }, [currentTab]);

    const getCurrentNodes = (): Record<string, NodeConfig | NodePackage> => {
        let nodes: Record<string, NodeConfig | NodePackage> = allNodeConfigs;
        for (const segment of currentPath) {
            nodes = (nodes[segment] as NodePackage).nodes;
        }
        return nodes;
    };

    const handleNodeClick = (nodeName: string) => {
        const node = getCurrentNodes()[nodeName];
        if ((node as NodePackage).nodes) {
            setCurrentPath([...currentPath, nodeName]);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const currentNodes = getCurrentNodes();

    const filterNodes = (nodes: Record<string, NodeConfig | NodePackage>, query: string) => {
        if (!query) return nodes;
        const lowerQuery = query.toLowerCase();
        return Object.fromEntries(Object.entries(nodes).filter(([name, config]) =>
            name.toLowerCase().includes(lowerQuery) ||
            ('title' in config && config.title?.toLowerCase().includes(lowerQuery))
        ));
    };

    const renderNodeList = (nodes: Record<string, NodeConfig | NodePackage>) => (
        <List spacing={2}>
            {Object.entries(nodes).map(([name, nodeConfig]) => (
                <ListItem
                    key={name}
                    draggable
                    onDragStart={(e) =>
                        handleNodeDragStart(e, (nodeConfig as NodeConfig).type, nodeConfig as NodeConfig)
                    }
                    opacity={0.5}
                    cursor="pointer"
                    p={2}
                    borderRadius="md"
                    bg="gray.100"
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => handleNodeClick(name)}
                >
                    {'title' in nodeConfig ? nodeConfig.title || name : name}
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box p={4} width="300px" bg="gray.50" borderRight="1px solid #ccc" height="100vh" display="flex" flexDirection="column" overflow="hidden">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Node Library</Text>
            <InputGroup>
                <InputLeftElement pointerEvents="none" mb={4}>
                    <Icon as={Search2Icon} />
                </InputLeftElement>
                <Input
                    placeholder="Search node"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>
            <Tabs
                isFitted
                variant='soft-rounded'
                orientation="vertical"
                flex="1"
                onChange={(index) => setCurrentTab(filteredNodeConfigs[index][0])}
            >
                <TabList
                    width="80px"
                    height="100%"
                    style={{
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                    }}
                    sx={{
                        '::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: 'gray',
                            borderRadius: '3px',
                        },
                    }}
                >
                    {filteredNodeConfigs.map(([category]) => (
                        <Tab fontSize='xs' key={category} flexShrink={0}>{category}</Tab>
                    ))}
                </TabList>
                <TabPanels flex={1} overflowY="auto"
                    style={{
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                    }}
                    sx={{
                        '::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: 'gray',
                            borderRadius: '3px',
                        },
                    }}>
                    {filteredNodeConfigs.map(([category]) => (
                        <TabPanel key={category} mt={2} height="100%">
                            <VStack align="stretch" height="100%">
                                <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={4}>
                                    {currentPath.map((segment, index) => (
                                        <BreadcrumbItem key={index}>
                                            <BreadcrumbLink onClick={() => handleBreadcrumbClick(index)}>
                                                {segment}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    ))}
                                </Breadcrumb>
                                {renderNodeList(filterNodes(currentNodes, searchQuery))}
                            </VStack>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default NodeDrawer;