import { Fontisto } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Modal } from 'react-native-paper';
import { PropTypes } from 'prop-types';
import { useTheme } from '@react-navigation/native';

const ImgPicker = (props) => {
  const { colors, fonts } = useTheme();

  const getPermissionGalery = async () => {
    if (Platform.OS !== 'web') {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'But... why?',
          'I need your permission to make this work!',
          [{ text: 'Hm..' }]
        );
        return false;
      }
      return true;
    }
  };

  const getPermissionCamera = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'But... why?',
          'I need your permission to make this work!',
          [{ text: 'Hm..' }]
        );
        return false;
      }
      return true;
    }
  };

  const setFromGalery = async () => {
    const hasPermission = await getPermissionGalery();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.09,
      base64: true,
    });

    if (!result.cancelled) {
      props.onSetImage(result);
    }
  };

  const setFromCamera = async () => {
    const hasPermission = await getPermissionCamera();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.09,
      base64: true,
    });

    if (!result.cancelled) {
      props.onSetImage(result);
    }
  };

  return (
    <Modal
      visible={props.visible}
      onDismiss={props.onDismiss}
      style={styles.modal}
    >
      <View style={styles.modalCard(colors)}>
        <TouchableWithoutFeedback onPress={setFromGalery}>
          <View style={styles.optionView}>
            <Fontisto name="photograph" size={34} color={colors.primary} />
            <Text style={styles.labelText(colors, fonts)}>Galery</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={setFromCamera}>
          <View style={styles.optionView}>
            <Fontisto name="camera" size={34} color={colors.primary} />
            <Text style={styles.labelText(colors, fonts)}>Camera</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: (colors) => ({
    backgroundColor: colors.background,
    width: '50%',
    borderRadius: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }),
  optionView: {
    margin: 15,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: (colors, fonts) => ({
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 12,
  }),
});

ImgPicker.propTypes = {
  onSetImage: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ImgPicker;
