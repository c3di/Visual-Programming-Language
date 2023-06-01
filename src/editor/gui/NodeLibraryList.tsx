import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { FilePond, registerPlugin } from 'react-filepond';
import {
  type ActualFileObject,
  type FilePondErrorDescription,
  type FilePondFile,
} from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilepondZipper from 'filepond-plugin-zipper';
import './NodeLibraryList.css';
import { SearchInput } from './elements';
import { type NodeConfig, type NodePackage } from '../types';
import NodeLibraryItem, { type INodeLibraryItem } from './NodeLibraryItem';

declare module 'react' {
  interface CSSProperties {
    '--vp-accordion-summary-hover-bgcolor'?: string;
    '--vp-accordion-panel-border-color'?: string;
  }
}

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
    <div
      style={{
        '--vp-accordion-summary-hover-bgcolor': '#f5f5f6f0',
        '--vp-accordion-panel-border-color': '#e0e0e0',
      }}
    >
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
      <div
        style={{ marginLeft: '4px', marginRight: '4px', marginBottom: '4px' }}
      >
        <SearchInput onChange={search} />
      </div>
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          borderTop: '0px',
          border: '1px solid var(--vp-accordion-panel-border-color)',

          '&:not(:last-child)': {
            borderBottom: '1px solid var(--vp-accordion-panel-border-color)  ',
            borderRight: '0px  ',
            borderLeft: '0px  ',
          },
          '&:before': {
            display: 'none',
          },
        }}
        expanded={expanded}
        onChange={() => {
          setExpanded((expanded) => {
            return !expanded;
          });
        }}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          sx={{
            minHeight: '10px !important',
            height: '33px !important',
            padding: '0px',
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(90deg)',
            },
            '&:hover': {
              backgroundColor: 'var(--vp-accordion-summary-hover-bgcolor)',
            },

            '& .MuiAccordionSummary-content': {
              marginLeft: '0px',
            },
          }}
          expandIcon={
            <PlayArrow
              sx={{ width: '12px', height: '12px', padding: '6px 8px 8px 8px' }}
            />
          }
        >
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

        <AccordionDetails
          sx={{ padding: '0px', borderTop: '1px solid rgba(0, 0, 0, .125)' }}
        >
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
    </div>
  );
}
