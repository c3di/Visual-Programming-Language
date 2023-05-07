import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
export default function Progress({ enable }: { enable: boolean }): JSX.Element {
  return enable ? <LinearProgress /> : <div style={{ height: 4 }}></div>;
}
