import LottieView from "lottie-react-native";
import { Text, View } from "react-native";
import tw from "../../src/utils/tailwind";

export default function AnalyticsScreen() {
  return <View style={tw`flex-1 items-center justify-center`}>
    <LottieView
      source={require("@/assets/empty.json")}
      style={tw`w-full h-2/3`}
      autoPlay
      loop
      />
      <Text style={tw`text-center text-2xl font-bold text-navy`}>Analytics Coming Soon</Text>
  </View>;
}
