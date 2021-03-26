import { useTheme } from '@react-navigation/native';
import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import { Modal, TextInput } from 'react-native-paper';

const PasswordConfirm = (props) => {
  const { colors, fonts } = useTheme();
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const save = () => {
    setIsSaving(true);
    props.onConfirm();
  };

  useEffect(() => {
    setIsSaving(false);
  }, [props.visible])

  return (
    <Modal
      visible={props.visible}
      onDismiss={props.onCancel}
      style={styles.modal}
    >
      {isSaving ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={styles.modalCard(colors)}>
          <View style={styles.formHolder}>
            <View style={styles.textHolder}>
              <Text style={styles.labelText(colors, fonts)}>
                Please confirm with password:
              </Text>
            </View>
            <View style={styles.inputHolder}>
              <TextInput
                label="Password"
                value={props.value}
                onChangeText={props.onChangeText}
                underlineColor={colors.accent}
                secureTextEntry={isSecureEntry}
                autoCapitalize={'none'}
                theme={{ colors }}
                right={
                  <TextInput.Icon
                    name={isSecureEntry ? 'eye-outline' : 'eye-off-outline'}
                    color="#808080"
                    onPress={() => setIsSecureEntry(!isSecureEntry)}
                  />
                }
              />
            </View>
            <View style={styles.buttonsHolder}>
              <View style={styles.wrapButton}>
                <TouchableNativeFeedback onPress={props.onCancel}>
                  <View style={styles.buttonCancel(colors)}>
                    <Text style={styles.textButton(colors, fonts)}>Cancel</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.wrapButton}>
                <TouchableNativeFeedback onPress={save}>
                  <View style={styles.buttonConfirm(colors)}>
                    <Text style={styles.textButton(colors, fonts)}>
                      Confirm
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: (colors) => ({
    width: '70%',
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 20,
  }),
  labelText: (colors, fonts) => ({
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  }),
  formHolder: {
    alignItems: 'center',
  },
  textHolder: {
    paddingBottom: 15,
  },
  inputHolder: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonsHolder: {
    width: '80%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancel: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
  }),
  buttonConfirm: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  }),
  textButton: (colors, fonts) => ({
    fontFamily: fonts.regular,
    color: colors.background,
    fontSize: 14,
    marginVertical: 10,
  }),
  wrapButton: {
    width: '45%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

PasswordConfirm.propTypes = {
  visible: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PasswordConfirm;
