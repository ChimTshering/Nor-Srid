import Ionicons from "@expo/vector-icons/Ionicons";
import { Button, Overlay, OverlayProps, Text, useTheme } from "@rneui/themed";
import { View } from "react-native";
import { Credit } from "../models/credit.model";
import tw from "../utils/tailwind";

interface DeleteModalProps extends OverlayProps {
	onConfirm: () => void;
    credit: Credit;
}
export const DeleteModal = (props: DeleteModalProps) => {
    const { theme} = useTheme();
	return (
		<Overlay {...props}>
			<View style={tw`bg-white gap-y-2 rounded-xl m-4`}>
				<Text style={tw`text-2xl font-bold text-center`}>Delete Credit</Text>
				<View
					style={tw`flex-row items-center gap-x-2 w-full rounded-lg p-2 bg-porcelain border border-mist-gray`}
				>
					<Ionicons name='warning-outline' size={36} color={theme?.colors?.secondary} />
					<Text style={[tw`text-sm font-bold w-[80%] text-justify`, {color: theme?.colors?.secondary}]}>
						This action cannot be undone and the credit will be deleted permanently.
					</Text>
				</View>
				<View style={tw`flex-row items-center justify-between`}>
					<View>
						<Text style={tw`text-sm font-bold text-slate`}>Creditor</Text>
						<Text style={tw`text-sm text-slate`}>
							{" "}
							{props.credit?.creditor}
						</Text>
					</View>
					<View>
						<Text style={tw`text-sm font-bold text-slate`}>Due Amount</Text>
						<Text style={tw`text-sm text-slate`}>
							{" "}
							{props.credit?.currency?.toUpperCase()} {props.credit?.dueAmt?.toFixed(2)}
						</Text>
					</View>
				</View>
				<View style={tw`flex-row gap-x-2 mt-2`}>
					<View style={tw`flex-1`}>
						<Button title='Delete' onPress={props.onConfirm} radius='sm' />
					</View>
					<View style={tw`flex-1`}>
						<Button
							title='Cancel'
							onPress={props.onBackdropPress}
							radius='sm'
							type='outline'
						/>
					</View>
				</View>
			</View>
		</Overlay>
	);
};