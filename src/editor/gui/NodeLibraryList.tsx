import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import NodeLibraryItem, { type INodeLibraryItem } from './NodeLibraryItem';
import { type NodeConfig, type NodePackage } from '../types';
import SearchInput from './SearchInput';
import { FilePond, registerPlugin } from 'react-filepond';
import {
  type ActualFileObject,
  type FilePondErrorDescription,
  type FilePondFile,
} from 'filepond';
import FilepondZipper from 'filepond-plugin-zipper';
import 'filepond/dist/filepond.min.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './NodeLibraryList.css';

registerPlugin(FilepondZipper());

function nodeConfigsToItemList(
  nodeConfigs: Record<string, NodePackage | NodeConfig>,
  keyword?: string
): INodeLibraryItem[] {
  const data: INodeLibraryItem[] = [];
  for (const name in nodeConfigs) {
    const config = nodeConfigs[name];
    if (config.notShowInMenu) continue;
    if (keyword && keyword !== '' && !name.includes(keyword)) continue;
    data.push({
      title: name,
      href: config.href,
      description: config.description,
    });
  }
  return data;
}
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: '1px solid #e0e0e0  ',
    borderRight: '0px  ',
    borderLeft: '0px  ',
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    sx={{
      minHeight: '10px !important',
      height: '33px !important',
      padding: '4px 0px 4px 0px !important',
    }}
    expandIcon={
      <PlayArrowIcon
        sx={{ width: '12px', height: '12px', padding: '6px 8px 8px 8px' }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  padding: '0px',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '& .MuiAccordionSummary-content': {
    marginLeft: '0px',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: '0px',
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export interface ITokens {
  authenticated: boolean;
  Authorization: null | string;
  'X-XSRFToken': null | string;
}

export default function NodeLibraryList({
  title,
  nodeExtensions,
  onUninstall,
  onEnable,
  onDisable,
  url,
  tokens,
}: {
  title: string;
  nodeExtensions: Record<string, NodePackage | NodeConfig>;
  onUninstall?: (pkg: string) => void;
  onEnable?: (pkg: string) => void;
  onDisable?: (pkg: string) => void;
  url?: string;
  tokens?: ITokens;
}): JSX.Element {
  const [itemList, setItemList] = useState<INodeLibraryItem[]>([]);
  const keyword = useRef<string>('');
  useEffect(() => {
    setItemList(nodeConfigsToItemList(nodeExtensions, keyword.current));
  }, [nodeExtensions]);

  const [expanded, setExpanded] = useState<boolean>(true);

  const search = useCallback(
    (searchKeyword: string) => {
      keyword.current = searchKeyword;
      setItemList(nodeConfigsToItemList(nodeExtensions, keyword.current));
    },
    [nodeExtensions]
  );
  const [files, setFiles] = useState<ActualFileObject[]>([]);

  return (
    <>
      <FilePond
        credits={false}
        files={files}
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
            onload: (response) => {
              console.log(response);
              return response;
            },
          },
          fetch: null,
          revert: null,
          restore: null,
        }}
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drop your package file/folder or <span class="filepond--label-action">Browse</span>'
        onerror={(
          error: FilePondErrorDescription,
          _file?: FilePondFile,
          status?: any
        ) => {
          console.log(error);
        }}
      />
      <SearchInput onChange={search} />
      <Accordion
        sx={{ borderTop: '0px' }}
        expanded={expanded}
        onChange={() => {
          setExpanded((expanded) => {
            return !expanded;
          });
        }}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography
            sx={{
              fontSize: '12.5px',
              letterSpacing: '1px',
              fontWeight: '405',
            }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </>
  );
}
