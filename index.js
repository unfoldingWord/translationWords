import Container from './src/Container';
import {connectTool} from 'tc-tool';
import path from 'path';
import api from './src/api';

export default connectTool('translationWords', {
  localeDir: path.join(__dirname, './src/locale'),
  api: new api()
})(Container);
