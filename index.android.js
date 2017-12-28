// @flow
import { NativeModules, PermissionsAndroid, Alert } from 'react-native';

const { Torch } = NativeModules;

/* Private fucntion to create a dialog with an OK button
 This is because the RN rationale dialog has no buttons, so isn't obvious to dismiss
 NOTE: We always show this dialog, if cameraPermission not present */
async function showRationaleDialog(title: string, message: string): Promise<*> {
  let done;
  const result = new Promise(resolve => {
    done = resolve;
  });

  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => done()
    }
  ]);

  return result;
}

async function requestCameraPermission(
  title: string,
  message: string
): Promise<boolean> {
  try {
    const hasCameraPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (hasCameraPermission) {
      return true;
    }

    await showRationaleDialog(title, message);

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

const TorchWithPermissionCheck = {
  ...Torch,
  requestCameraPermission
};

export default TorchWithPermissionCheck;
