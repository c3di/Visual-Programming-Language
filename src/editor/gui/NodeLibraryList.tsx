import React, { useEffect, useState } from 'react';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { styled } from '@mui/material/styles';
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import NodeLibraryItem, { type INodeLibraryItem } from './NodeLibraryItem';
import { type NodeConfig, type NodePackage } from '../types';

function nodeConfigsToItemList(
  nodeConfigs: Record<string, NodePackage | NodeConfig>
): INodeLibraryItem[] {
  const data: INodeLibraryItem[] = [];
  for (const name in nodeConfigs) {
    const config = nodeConfigs[name];
    if (config.notShowInMenu) continue;
    console.log(name);
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
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: '0px',
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function NodeLibraryList({
  title,
  nodeExtensions,
  onUninstall,
  onEnable,
  onDisable,
}: {
  title: string;
  nodeExtensions: Record<string, NodePackage | NodeConfig>;
  onUninstall?: (pkg: string) => void;
  onEnable?: (pkg: string) => void;
  onDisable?: (pkg: string) => void;
}): JSX.Element {
  const [itemList, setItemList] = useState<INodeLibraryItem[]>([]);
  useEffect(() => {
    setItemList(nodeConfigsToItemList(nodeExtensions));
  }, [nodeExtensions]);

  const [expanded, setExpanded] = useState<boolean>(true);
  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded((expanded) => {
          return !expanded;
        });
      }}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>{title}</Typography>
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
  );
}
