import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Auth from '../components/Auth';
import Settings from './Settings';
import { PropTypes } from 'prop-types';

const Options = (props) => {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      props.onSettings();
    }
  });

  return (
    <View style={styles.screen}>
      <View style={styles.optionsWrapper}></View>
      {token ? (
        <Settings onGoBack={props.onMenu} />
      ) : (
        <Auth
          onGoBack={props.onMenu}
          onSignUp={props.onSignUp}
          onLogin={props.onLogin}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  optionsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Options.propTypes = {
  onSettings: PropTypes.func.isRequired,
  onMenu: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default Options;
