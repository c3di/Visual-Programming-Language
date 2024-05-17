import React, { useState, useEffect } from 'react';
import {
    Box, Input, InputGroup, InputLeftElement, Text, Icon, Tabs, TabList, TabPanels, Tab, TabPanel,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { ChonkyActions, FileBrowser, FileNavbar, FileData, FileList, FileHelper, ChonkyFileActionData, ChonkyIconName, FileViewConfig, FileViewMode } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { nodeConfigRegistry } from '../extension';
import { NodeConfig, NodePackage } from '../types';

const nodeConfigsToFileData = (
    nodeConfigs: Record<string, NodeConfig | NodePackage>,
    parentId: string = ''
): FileData[] => {
    return Object.entries(nodeConfigs).map(([name, config]) => {
        const typedConfig = config as NodeConfig | NodePackage;
        return {
            id: parentId ? `${parentId}.${name}` : name,
            name: 'title' in typedConfig ? typedConfig.title || name : name,
            isDir: 'isPackage' in typedConfig ? true : false,
            children: 'nodes' in typedConfig ? nodeConfigsToFileData(typedConfig.nodes, parentId ? `${parentId}.${name}` : name) : undefined,
        };
    });
};

interface CustomFileEntryProps {
    file: FileData;
}

const CustomFileEntry: React.FC<CustomFileEntryProps> = ({ file }) => (
    <Box
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        _hover={{ backgroundColor: 'gray.100' }}
    >
        <Text>{file.name}</Text>
    </Box>
);

const NodeDrawer = ({
    handleNodeDragStart,
}: {
    handleNodeDragStart: (
        event: React.DragEvent<HTMLLIElement>,
        nodeType: string,
        nodeData: NodeConfig
    ) => void;
}) => {
    const allNodeConfigs = nodeConfigRegistry.getAllNodeConfigs();
    const filteredNodeConfigs = Object.entries(allNodeConfigs).filter(
        ([, config]) => 'nodes' in config && Object.keys(config.nodes ?? {}).length > 0
    );

    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [breadcrumbFiles, setBreadcrumbFiles] = useState<FileData[]>([]);
    const [currentFiles, setCurrentFiles] = useState<FileData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTab, setCurrentTab] = useState<string | null>(null);

    const loadFiles = (folderId: string) => {
        const findNodeConfig = (configs: Record<string, NodeConfig | NodePackage>, id: string): NodeConfig | NodePackage | undefined => {
            const path = id.split('.');
            let node = configs[path[0]];
            for (let i = 1; i < path.length; i++) {
                if (node && 'nodes' in node) {
                    node = node.nodes[path[i]] as NodePackage | NodeConfig;
                } else {
                    return undefined;
                }
            }
            return node;
        };

        const nodeConfig = findNodeConfig(allNodeConfigs, folderId);
        let files: FileData[] = [];
        if (nodeConfig && 'nodes' in nodeConfig) {
            files = nodeConfigsToFileData(nodeConfig.nodes, folderId);
        }
        setCurrentFiles(files);
    };

    const handleFileAction = (data: ChonkyFileActionData) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            const { targetFile } = data.payload;
            if (targetFile && FileHelper.isDirectory(targetFile)) {
                setCurrentFolderId(targetFile.id);
                loadFiles(targetFile.id);
                setBreadcrumbFiles((prev) => [...prev, targetFile]);
            }
        } else if (data.id === ChonkyActions.MouseClickFile.id) {
            const file = data.payload.file as FileData;
            if (file && !FileHelper.isDirectory(file)) {
                const findNodeConfig = (configs: Record<string, NodeConfig | NodePackage>, id: string): NodeConfig | NodePackage | undefined => {
                    const path = id.split('.');
                    let node = configs[path[0]];
                    for (let i = 1; i < path.length; i++) {
                        if (node && 'nodes' in node) {
                            node = node.nodes[path[i]] as NodePackage | NodeConfig;
                        } else {
                            return undefined;
                        }
                    }
                    return node;
                };

                if (file) {
                    const nodeConfig = findNodeConfig(allNodeConfigs, file['id']);
                    if (nodeConfig && 'type' in nodeConfig) {
                        const dragEvent = new DragEvent('dragstart', { bubbles: true, cancelable: true }) as unknown as React.DragEvent<HTMLLIElement>;
                        handleNodeDragStart(dragEvent, nodeConfig.type, nodeConfig as NodeConfig);
                    }
                }
            }
        }
    };

    const handleBreadcrumbClick = (file: FileData, index: number) => {
        const newBreadcrumbFiles = breadcrumbFiles.slice(0, index + 1);
        setBreadcrumbFiles(newBreadcrumbFiles);
        setCurrentFolderId(file.id);
        loadFiles(file.id);
    };

    useEffect(() => {
        if (currentTab !== null) {
            setCurrentFolderId(currentTab);
            loadFiles(currentTab);
            setBreadcrumbFiles([{ id: currentTab, name: currentTab, isDir: true }]);
        }
    }, [currentTab]);

    return (
        <Box p={4} width="300px" bg="gray.50" borderRight="1px solid #ccc" height="100%" flexDirection="column">
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
                mt={8}
                maxHeight="100%"
                onChange={(index) => setCurrentTab(filteredNodeConfigs[index][0])}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <TabList overflow="scroll"
                    sx={{
                        width: '80px',
                        height: '100%',
                        scrollbarWidth: 'none',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        }
                    }}
                >
                    {filteredNodeConfigs.map(([category]) => (
                        <Tab fontSize='xs' key={category} flexShrink={0}>{category}</Tab>
                    ))}
                </TabList>
                <TabPanels
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        height: '670',
                    }}>
                    {filteredNodeConfigs.map(([category]) => (
                        <TabPanel key={category} mt={2} height="100%" display="flex" flexDirection="column">
                            <Box flex="1" display="flex" flexDirection="column" height="100%">
                                <FileBrowser
                                    files={currentFiles}
                                    folderChain={breadcrumbFiles}
                                    onFileAction={handleFileAction}
                                    defaultFileViewActionId={ChonkyActions.EnableListView.id}
                                    disableDefaultFileActions
                                    fileActions={[ChonkyActions.OpenFiles, ChonkyActions.MouseClickFile]}
                                    iconComponent={ChonkyIconFA as any}
                                >
                                    <FileNavbar />
                                    <FileList />
                                    {CustomFileEntry as any}
                                </FileBrowser>
                            </Box>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default NodeDrawer;
