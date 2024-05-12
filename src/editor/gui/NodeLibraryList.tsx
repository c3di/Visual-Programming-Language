import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Text
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FilePond, registerPlugin } from 'react-filepond';
import {
  type FilePondErrorDescription,
  type FilePondFile,
} from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilepondZipper from 'filepond-plugin-zipper';
import { SearchInput } from './elements';
import { type NodeConfig, type NodePackage } from '../types';
import NodeLibraryItem, { INodeLibraryItem } from './NodeLibraryItem';
import './NodeLibraryList.css';

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

  const [expanded, setExpanded] = useState<boolean>(true);

  const search = useCallback((searchKeyword: string) => {
    keyword.current = searchKeyword;
    setItemList(nodeConfigsToItemList(nodeExtensions, keyword.current));
  }, [nodeExtensions]);

  const [files, setFiles] = useState<[]>([]);
  const [showClearButton, setShowClearButton] = useState<boolean>(false);

  const handleFileProcess = (
    error: FilePondErrorDescription | null,
    fileItem: FilePondFile
  ): void => {
    if (!error) {
      setShowClearButton(true);
    }
    setShowClearButton(true);
  };

  const handleClear = () => {
    setFiles([]);
    setShowClearButton(false);
  };


  return (
    <Box className="vp-nodelibrary" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FilePond
        files={files}
        onprocessfile={handleFileProcess}
        onupdatefiles={(fileItems) => {
          setFiles(fileItems.map((fileItem) => fileItem.file));
        }}
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
        labelIdle='<span class="filepond--label">Drop your package file/folder or <span class="filepond--label-action">Browse</span></span>'
        onerror={(
          error: FilePondErrorDescription,
          _file?: FilePondFile,
          status?: any
        ) => {
          console.log(error);
        }}
      />
      {showClearButton && <Button onClick={handleClear}>Clear</Button>}
      <Box my="4px" fontSize="14px">
        <SearchInput onChange={search} />
      </Box>
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="var(--vp-accordion-summary-font-size)" fontFamily="var(--vp-accordion-font-family)" fontWeight="var(--vp-accordion-font-weight)">
                  INSTALLED
                </Text>
              </Box>
              <AccordionIcon as={ChevronDownIcon} boxSize={16} />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {itemList.map((item) => (
              <NodeLibraryItem
                key={item.title + (item.href ?? '')}
                title={item.title}
                href={item.href}
                description={item.description}
                onUninstall={() => {
                  onUninstall?.(item.title);
                }}
                onEnable={() => {
                  onEnable?.(item.title);
                }}
                onDisable={() => {
                  onDisable?.(item.title);
                }}
              />
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
