import {connectTool} from 'tc-tool';
import {connect} from 'react-redux';
import path from 'path';
import {
  Api,
  Container,
  mapStateToProps
} from 'checking-tool-wrapper';

export default connectTool('translationWords', {
  localeDir: path.join(__dirname, './src/locale'),
  api: new Api()
})(connect(mapStateToProps)(Container));
