import React, { useState, useEffect } from 'react';
import {
    Box, Input, InputGroup, InputLeftElement, InputRightElement, List, ListItem, VStack, Text, Icon, Tabs, TabList, TabPanels, Tab, TabPanel, Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack, Badge, CloseButton,
} from '@chakra-ui/react';
import { Search2Icon, ChevronRightIcon } from '@chakra-ui/icons';
import { HiFolder } from "react-icons/hi2";
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
    const [searchResults, setSearchResults] = useState<Record<string, { nodes: Record<string, NodeConfig | NodePackage>, packages: Record<string, NodePackage> }>>({});

    useEffect(() => {
        if (currentTab) {
            setCurrentPath([currentTab]);
        }
    }, [currentTab]);

    useEffect(() => {
        if (searchQuery) {
            const results: Record<string, { nodes: Record<string, NodeConfig | NodePackage>, packages: Record<string, NodePackage> }> = {};
            filteredNodeConfigs.forEach(([category, config]) => {
                const { nodes, packages } = searchAllNodes(config.nodes, searchQuery);
                if (Object.keys(nodes).length > 0 || Object.keys(packages).length > 0) {
                    results[category] = { nodes, packages };
                }
            });
            setSearchResults(results);
        } else {
            setSearchResults({});
        }
    }, [searchQuery]);

    const getCurrentNodes = (): Record<string, NodeConfig | NodePackage> => {
        let nodes: Record<string, NodeConfig | NodePackage> = allNodeConfigs;
        for (const segment of currentPath) {
            nodes = (nodes[segment] as NodePackage).nodes;
        }
        return nodes;
    };

    const handleNodeClick = (nodeName: string) => {
        const nodes = getCurrentNodes();
        const node = nodes[nodeName] as NodePackage | NodeConfig;
        if ((node as NodePackage).nodes) {
            setCurrentPath([...currentPath, nodeName]);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const searchAllNodes = (nodes: Record<string, NodeConfig | NodePackage>, query: string): { nodes: Record<string, NodeConfig | NodePackage>, packages: Record<string, NodePackage> } => {
        const lowerQuery = query.toLowerCase();
        const nodeResults: Record<string, NodeConfig | NodePackage> = {};
        const packageResults: Record<string, NodePackage> = {};

        Object.entries(nodes).forEach(([name, config]) => {
            if (
                name.toLowerCase().includes(lowerQuery) ||
                ('title' in config && config.title?.toLowerCase().includes(lowerQuery))
            ) {
                if ((config as NodePackage).nodes) {
                    packageResults[name] = config as NodePackage;
                } else {
                    nodeResults[name] = config;
                }
            }

            if ((config as NodePackage).nodes) {
                const { nodes: childNodes, packages: childPackages } = searchAllNodes((config as NodePackage).nodes, query);
                Object.assign(nodeResults, childNodes);
                Object.assign(packageResults, childPackages);
            }
        });

        return { nodes: nodeResults, packages: packageResults };
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
                    <HStack>
                        {(nodeConfig as NodePackage).nodes && <Icon as={HiFolder} />}
                        <Text style={{ overflowWrap: 'anywhere' }}>
                            {'title' in nodeConfig ? nodeConfig.title || name : name}
                        </Text>
                    </HStack>
                </ListItem>
            ))}
        </List>
    );

    const visibleTabs = !searchQuery
        ? filteredNodeConfigs
        : filteredNodeConfigs.filter(([category]) => searchResults[category]);

    return (
        <Box p={4} width="300px" bg="gray.50" borderRight="1px solid #ccc" height="100vh" display="flex" flexDirection="column" overflow="hidden">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Node Library</Text>
            <InputGroup mb={8}>
                <InputLeftElement pointerEvents="none">
                    <Icon as={Search2Icon} />
                </InputLeftElement>
                <Input
                    placeholder="Search node"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement>
                    {searchQuery && <CloseButton size="sm" onClick={() => setSearchQuery('')} />}
                </InputRightElement>
            </InputGroup>
            <Tabs
                variant='soft-rounded'
                orientation="vertical"
                maxW="100%"
                onChange={(index) => setCurrentTab(visibleTabs[index][0])}
            >
                <TabList
                    width={searchQuery ? "170px" : "120px"}
                    height="100%"
                    style={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
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
                    {visibleTabs.map(([category]) => (
                        <Tab key={category}
                            fontSize="xs"
                            height="max-content"
                            minWidth="0"
                            width="100%"
                            p={4}
                            whiteSpace="pre-wrap"
                            textOverflow="ellipsis"
                            alignItems="flex-start"
                        >
                            <HStack justifyContent="center" alignItems="center" width="100%" gap="0.2rem">
                                <Text>{category}</Text>
                                {searchResults[category] && (
                                    <Badge colorScheme="red" borderRadius="50%">
                                        {Object.keys(searchResults[category].nodes).length + Object.keys(searchResults[category].packages).length}
                                    </Badge>
                                )}
                            </HStack>
                        </Tab>
                    ))}
                </TabList>
                <TabPanels
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
                    {visibleTabs.map(([category]) => (
                        <TabPanel key={category} mt={2} height="100%">
                            <VStack align="stretch" height="100%">
                                <Breadcrumb
                                    separator={<ChevronRightIcon color="gray.500" />}
                                    mb={4}
                                    style={{
                                        overflowWrap: 'anywhere'
                                    }}
                                >
                                    {currentPath.map((segment, index) => (
                                        <BreadcrumbItem key={index}>
                                            <BreadcrumbLink onClick={() => handleBreadcrumbClick(index)}>
                                                {segment}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    ))}
                                </Breadcrumb>
                                {searchQuery && searchResults[currentPath[0]]
                                    ? renderNodeList(currentPath.length > 1 ? getCurrentNodes() : { ...searchResults[currentPath[0]].packages, ...searchResults[currentPath[0]].nodes })
                                    : renderNodeList(getCurrentNodes())}
                            </VStack>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default NodeDrawer;
