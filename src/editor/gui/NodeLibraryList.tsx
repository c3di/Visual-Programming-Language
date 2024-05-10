import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button
} from '@chakra-ui/react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilepondZipper from 'filepond-plugin-zipper';
import { SearchInput } from './elements';
import NodeLibraryItem, { INodeLibraryItem } from './NodeLibraryItem';

interface ITokens {
  authenticated: boolean;
  Authorization: string | null;
  'X-XSRFToken': string | null;
}

interface INodeLibraryListProps {
  title: string;
  nodeExtensions: Record<string, NodePackage | NodeConfig>;
  onInstall?: (pkg: any) => void;
  onUninstall?: (pkg: string) => void;
  onEnable?: (pkg: string) => void;
  onDisable?: (pkg: string) => void;
  url?: string;
  tokens?: ITokens;
}

// Register Filepond plugin
registerPlugin(FilepondZipper());

// Helper function to transform node configurations to a list item array
function nodeConfigsToItemList(
  nodeConfigs: Record<string, NodePackage | NodeConfig>,
  keyword?: string
): INodeLibraryItem[] {
  const data: INodeLibraryItem[] = [];
  for (const name in nodeConfigs) {
    if (keyword && keyword !== '' && !name.includes(keyword)) continue;
    const config = nodeConfigs[name];
    data.push({
      title: name,
      href: config.href,
      description: config.description,
    });
  }
  return data;
}

// Main component definition
export default function NodeLibraryList({
  title,
  nodeExtensions,
  onInstall,
  onUninstall,
  onEnable,
  onDisable,
  url,
  tokens,
}: INodeLibraryListProps): JSX.Element {
  const [itemList, setItemList] = useState<INodeLibraryItem[]>([]);
  const keyword = useRef<string>('');

  useEffect(() => {
    setItemList(nodeConfigsToItemList(nodeExtensions, keyword.current));
  }, [nodeExtensions]);

  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [showClearButton, setShowClearButton] = useState(false);

  const handleFileProcess = (error: FilePondErrorDescription | null, fileItem: FilePondFile) => {
    setShowClearButton(!error);
  };

  const handleClear = () => {
    setFiles([]);
    setShowClearButton(false);
  };

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    setFiles(fileItems.map(file => file.file));
  };

  const search = useCallback((searchKeyword: string) => {
    keyword.current = searchKeyword;
    setItemList(nodeConfigsToItemList(nodeExtensions, keyword.current));
  }, [nodeExtensions]);

  return (
    <Box className="vp-nodelibrary" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FilePond
        files={files.map(file => file.file)}
        onprocessfile={handleFileProcess}
        onupdatefiles={handleUpdateFiles}
        allowMultiple={true}
        allowRevert={false}
        server={{
          process: {
            url: url ?? '',
            method: 'POST',
            withCredentials: false,
            headers: {
              Authorization: tokens?.Authorization ?? '',
              'X-XSRFToken': tokens?.['X-XSRFToken'] ?? '',
            },
            timeout: 7000,
            onload: (response) => onInstall?.(response),
          },
        }}
        name="files"
        labelIdle='Drop your package file/folder or <span class="filepond--label-action">Browse</span>'
      />
      {showClearButton && <Button onClick={handleClear}>Clear</Button>}
      <Box my="4px" fontSize="14px">
        <SearchInput onChange={search} />
      </Box>
      <Accordion allowMultiple>
        {itemList.map((item, index) => (
          <AccordionItem key={index}>
            <AccordionButton>
              <Box flex="1" textAlign="left">{item.title}</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <NodeLibraryItem
                title={item.title}
                href={item.href}
                description={item.description}
                onUninstall={() => onUninstall?.(item.title)}
                onEnable={() => onEnable?.(item.title)}
                onDisable={() => onDisable?.(item.title)}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
