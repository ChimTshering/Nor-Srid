import { STORAGE_KEYS } from "@/src/constants/constant";
import { biometricAuth } from "@/src/setvices/local_authentication.service";
import { localStorage } from "@/src/setvices/storage.services";
import { Redirect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [showModel, setShowModel] = useState(false);
  const getFaceId = useCallback(async () => {
    const faceId = await localStorage.getData(STORAGE_KEYS.FACE_ID);
    if (!faceId) {
      setShowModel(true);
    }
  }, []);
  useEffect(() => {
    getFaceId();
  }, [getFaceId]);

  const setUserBiometric = useCallback(async () => {
    await biometricAuth.setBiometric();
    router.navigate("/(tab)");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {showModel ? <Redirect href={"/(tab)/credit"} /> : <Redirect href={"/(tab)/credit"} />}
    </View>
  );
}
