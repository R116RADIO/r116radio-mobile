import { connect } from 'react-redux';
import { audioActionCreators } from './actions';

function mapStateToProps({ audios }) {
  return {
    audios
  };
}

const mapDispatchToProps = audioActionCreators;

export function connectAudios(configMapStateToProps = mapStateToProps) {
  return connect(
    configMapStateToProps,
    mapDispatchToProps,
  );
}
