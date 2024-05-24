import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Box, Input, InputGroup, InputLeftElement, List, ListItem, VStack, Text, Icon, Tabs, TabList, TabPanels, Tab, TabPanel, Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack, Badge, InputRightElement, useTheme
} from '@chakra-ui/react';
import { Search2Icon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import { HiFolder } from "react-icons/hi2";
import { nodeConfigRegistry } from '../extension';
import { NodeConfig, NodePackage } from '../types';
import { useHotkeys } from 'react-hotkeys-hook';

function NodeDrawer({
    handleNodeDragStart,
    handleNodeClick,
}: {
    handleNodeDragStart: (
        event: React.DragEvent<HTMLLIElement>,
        nodeType: string,
        nodeData: NodeConfig
    ) => void;
    handleNodeClick: (
        nodeConfig: NodeConfig
    ) => void;
}) {
    const theme = useTheme();
    const filteredNodeConfigs = useMemo(() => {
        return Object.entries(nodeConfigRegistry.getAllNodeConfigs()).filter(
            ([, config]) => Object.keys(config.nodes ?? {}).length > 0
        );
    }, [nodeConfigRegistry]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [tabState, setTabState] = useState({
        currentTabIndex: 0,
        currentTab: filteredNodeConfigs.length ? filteredNodeConfigs[0][0] : null
    });
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Record<string, { nodes: Record<string, NodeConfig | NodePackage>, packages: Record<string, NodePackage> }>>({});
    const [focusedNode, setFocusedNode] = useState<number | null>(null);

    const nodeListRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (tabState.currentTab && currentPath[0] !== tabState.currentTab) {
            setCurrentPath([tabState.currentTab]);
        }
    }, [tabState.currentTab, currentPath]);


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

    useEffect(() => {
        if (searchQuery && nodeListRef.current) {
            const firstNode = nodeListRef.current.firstChild as HTMLElement;
            if (firstNode) {
                firstNode.focus();
            }
        }
    }, [searchResults]);

    const visibleTabs = !searchQuery
        ? filteredNodeConfigs
        : filteredNodeConfigs.filter(([category]) => searchResults[category]);


    const upKey = (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (focusedNode !== null) {
            setFocusedNode((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
        } else {
            const newIndex = Math.max(0, tabState.currentTabIndex - 1);
            handleTabChange(newIndex);
        }
    }

    useHotkeys('up', (event: KeyboardEvent) => {
        upKey(event as unknown as React.KeyboardEvent);
    }, [visibleTabs.length, focusedNode, tabState.currentTabIndex]);

    const downKey = (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (focusedNode !== null) {
            setFocusedNode((prev) => (prev !== null && nodeListRef.current && prev < nodeListRef.current.children.length - 1 ? prev + 1 : prev));
        } else {
            const newIndex = Math.min(visibleTabs.length - 1, tabState.currentTabIndex + 1);
            handleTabChange(newIndex);
        }
    }

    useHotkeys('down', (event) => {
        downKey(event as unknown as React.KeyboardEvent);
    }, [visibleTabs.length, focusedNode, tabState.currentTabIndex]);

    const leftKey = (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (focusedNode !== null) {
            setFocusedNode(null);
        } else if (currentPath.length > 1) {
            setCurrentPath((prev) => prev.slice(0, -1));
            setFocusedNode(0);
        }
    }

    useHotkeys('left', (event) => {
        leftKey(event as unknown as React.KeyboardEvent)
    }, [focusedNode, currentPath]);

    const rightKey = (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (focusedNode === null && nodeListRef.current && nodeListRef.current.children.length > 0) {
            setFocusedNode(0);
            (nodeListRef.current.children[0] as HTMLElement)?.focus();
        }
    }

    useHotkeys('right', (event) => {
        rightKey(event as unknown as React.KeyboardEvent);
    }, [focusedNode]);

    const enterKey = (event: React.KeyboardEvent) => {
        event.preventDefault();
        if (focusedNode !== null && nodeListRef.current) {
            const node = nodeListRef.current.children[focusedNode] as HTMLLIElement;
            node.click();
        }
    }

    useHotkeys('enter', (event) => {
        enterKey(event as unknown as React.KeyboardEvent);
    }, [focusedNode]);

    useHotkeys('esc', () => {
        setFocusedNode(null);
        setTabState({ currentTabIndex: 0, currentTab: filteredNodeConfigs.length ? filteredNodeConfigs[0][0] : null });
    }, [focusedNode]);



    const getCurrentNodes = (): Record<string, NodeConfig | NodePackage> => {
        let nodes: Record<string, NodeConfig | NodePackage> = nodeConfigRegistry.getAllNodeConfigs();
        for (const segment of currentPath) {
            nodes = (nodes[segment] as NodePackage).nodes;
        }
        return nodes;
    };


    const handleTabChange = useCallback((index: number) => {
        setTabState(prev => {
            if (index !== prev.currentTabIndex) {
                return {
                    ...prev,
                    currentTabIndex: index,
                    currentTab: visibleTabs[index][0]
                };
            }
            return prev;
        });
        setFocusedNode(null);
    }, [visibleTabs]);

    const handleTabClick = (index: number) => {
        const activeElement = document.activeElement as HTMLElement;
        activeElement?.blur();
        handleTabChange(index);
    };


    const handleNodeClickLocal = (nodeName: string) => {
        const nodes = getCurrentNodes();
        const node = nodes[nodeName];
        if (node && 'nodes' in node) {
            setCurrentPath([...currentPath, nodeName]);
            setFocusedNode(0);
        } else {
            handleNodeClick(node as NodeConfig);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
        setFocusedNode(0);
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

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            upKey(event);
        } else if (event.key === "ArrowDown") {
            downKey(event);
        } else if (event.key === "ArrowLeft") {
            leftKey(event);
        } else if (event.key === "ArrowRight") {
            rightKey(event);
        } else if (event.key === "Enter") {
            enterKey(event);
        }
    };

    const renderNodeList = (nodes: Record<string, NodeConfig | NodePackage>) => (
        <List spacing={2} ref={nodeListRef}>
            {Object.entries(nodes).map(([name, nodeConfig], index) => (
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
                    bg={index === focusedNode ? 'blue.100' : 'gray.100'}
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => handleNodeClickLocal(name)}
                    tabIndex={0}
                    onFocus={() => setFocusedNode(index)}
                    onMouseDown={(e) => e.preventDefault()}
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
                    onKeyDown={handleSearchKeyDown}
                    ref={searchInputRef}
                />
                <InputRightElement>
                    <Icon as={CloseIcon} cursor="pointer" onClick={() => setSearchQuery('')} />
                </InputRightElement>
            </InputGroup>
            <Tabs
                isFitted
                variant='soft-rounded'
                orientation="vertical"
                maxW="100%"
                onMouseDown={(e) => e.preventDefault()}
            >
                <TabList
                    key={tabState.currentTabIndex}
                    width={searchQuery ? "200px" : "120px"}
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
                    {visibleTabs.map(([category], index) => (
                        <Tab
                            key={category}
                            fontSize="2xs"
                            height="40px"
                            minWidth="0"
                            width="100%"
                            p={4}
                            whiteSpace="pre-wrap"
                            textOverflow="ellipsis"
                            style={{
                                backgroundColor: tabState.currentTabIndex === index ? theme.colors.blue[100] : 'transparent',
                            }}
                            onClick={(e) => { e.preventDefault(); handleTabClick(index) }}
                            onMouseDown={(e) => e.preventDefault()}
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
                                    mb={4}>
                                    {currentPath.map((segment, index) => (
                                        <BreadcrumbItem key={index}>
                                            <BreadcrumbLink onClick={() => handleBreadcrumbClick(index)}
                                                style={{
                                                    overflowWrap: 'anywhere'
                                                }}>
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
        </Box >
    );
}

export default NodeDrawer;
