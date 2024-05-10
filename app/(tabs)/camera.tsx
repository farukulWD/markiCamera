import React, { useEffect, useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  FlashMode,
} from "expo-camera/legacy";
import * as MediaLibrary from "expo-media-library";
import CustomButton from "@/components/CustomButton";

export default function CameraPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [image, setImage] = useState("");
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [againTry, setAgainTry] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, [againTry]);
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!hasCameraPermission) {
    return <View />;
  }

  if (!hasCameraPermission) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={() => setAgainTry(!againTry)}
          title="grant permission"
        />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data: CameraCapturedPicture = await (
          cameraRef.current as Camera
        ).takePictureAsync();
        setImage(data?.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const save = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("image saved has been successful");
        setImage("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleFlash = () => {
    setFlash(flash === "on" ? FlashMode.off : FlashMode.on);
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          ratio="16:9"
        >
          <View
            style={{
              paddingTop: 40,
              paddingHorizontal: 40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CustomButton
              title=""
              color=""
              icon={"retweet"}
              onPress={toggleCameraType}
            ></CustomButton>
            <CustomButton
              title=""
              color=""
              icon={flash === "on" ? "flashlight" : "flash"}
              onPress={handleFlash}
            ></CustomButton>
          </View>
        </Camera>
      ) : (
        <Image
          source={{ uri: image }}
          style={[
            styles.image,
            type === CameraType.front && { transform: [{ scaleX: -1 }] },
          ]}
        ></Image>
      )}
      <View style={styles.button_container}>
        {image ? (
          <View style={styles.image_buttons}>
            <CustomButton
              title="Retake Picture"
              color=""
              icon={"retweet"}
              onPress={() => setImage("")}
            ></CustomButton>
            <CustomButton
              title="Save"
              color=""
              icon={"save"}
              onPress={save}
            ></CustomButton>
          </View>
        ) : (
          <CustomButton
            title="Take a picture"
            color=""
            icon={"camera"}
            onPress={takePicture}
          ></CustomButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  button_container: {
    backgroundColor: "#000",
  },
  image: {
    flex: 1,
  },
  image_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
});
