import { LoadDefaultModule } from './extension';
import './index.css';
export { default as VPEditor } from './VPEditor';
export * from './extension';
export * from './types';
export * from './widgets';
export * from './gui';
export * from './hooks';
LoadDefaultModule();
