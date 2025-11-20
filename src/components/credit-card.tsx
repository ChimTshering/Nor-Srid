import { Card, Text } from "@rneui/themed";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { CREDIT_STATUS } from "../constants/constant";
import { Credit } from "../models/credit.model";
import tw from "../utils/tailwind";

interface CreditCardProps {
    credit: Credit;
    onLongPress?: () => void;
	onPress?: () => void;
}

export const CreditCard = ({ credit, onLongPress, onPress }: CreditCardProps) => {
    const isPastDue =useMemo(() => dayjs(credit?.dueDate).isBefore(dayjs()) && credit?.status !== CREDIT_STATUS.PAID, [credit]);
	const status = useMemo(() => {
		switch (credit?.status) {
			case CREDIT_STATUS.PAID:
				return "success";
			case CREDIT_STATUS.CANCELLED:
				return "error";
			default:
				return "warning";
		}
	}, [credit?.status]);
	return (
		<Card containerStyle={tw`rounded-md relative`}>
			<Pressable onPress={onPress} onLongPress={onLongPress}>
				<View style={tw`flex-row items-center justify-between`}>
					<Text style={tw`text-2xl font-bold`}>
						{credit?.currency?.toUpperCase()} {Number(credit?.dueAmt).toFixed(2)}
					</Text>
					<StatusBadge status={credit?.status ?? CREDIT_STATUS.PENDING} />
				</View>
				<View style={tw`flex-row items-center justify-between`}>
					<Text style={tw`text-sm text-slate`}>
						Creditor: <Text style={tw`font-bold`}>{credit?.creditor}</Text>
					</Text>
				</View>
				<View style={tw`flex-row items-center justify-between`}>
					<Text style={tw`text-sm text-slate`}>
						Date:{" "}
						<Text style={tw`font-bold`}>
							{dayjs(credit?.createdAt)?.format("MMM DD, YYYY")}
						</Text>
					</Text>
						<Text style={tw`text-sm text-slate`}>
						Time:{" "}
						<Text style={tw`font-bold`}>
							{dayjs(credit?.createdAt)?.format("hh:mm A")}
						</Text>
					</Text>
				</View>
				<View style={tw`flex-row items-center justify-between`}>
					<Text
						style={tw`text-sm ${isPastDue ? "text-danger" : "text-slate"}`}
					>
						Due Date:{" "}
						<Text style={tw`font-bold`}>
							{dayjs(credit?.dueDate)?.format("MMM DD, YYYY")}
						</Text>
					</Text>
					<Text
						style={tw`text-sm ${isPastDue ? "text-danger" : "text-slate"}`}
					>
						Due Time:{" "}
						<Text style={tw`font-bold`}>
							{dayjs(credit?.dueTime)?.format("hh:mm A")}
						</Text>
					</Text>
				</View>
				{credit?.status === CREDIT_STATUS.PAID && (
					<Text style={tw`text-sm text-slate`}>
						Paid on:{" "}
						<Text style={tw`font-bold`}>
							{dayjs(credit?.updatedAt)?.format("MMM DD, YYYY")} |{" "}
							{dayjs(credit?.updatedAt)?.format("hh:mm A")}
						</Text>
					</Text>
				)}
				{/* <Text style={tw`text-sm text-slate`}>
					Credit Reason:{" "}
					<Text style={tw`font-bold`}>{credit?.description ?? "N/A"}</Text>
				</Text>
				{credit?.status === CREDIT_STATUS.CANCELLED && (
					<Text style={tw`text-sm text-slate`}>
						cancelled Reason:{" "}
						<Text style={tw`font-bold`}>{credit?.cancelledReason ?? "N/A"}</Text>
					</Text>
				)} */}
			</Pressable>
			{isPastDue && (
				<Animated.Text
					style={tw`absolute text-danger text-6xl top-1/5 left-0 right-0 bottom-0 font-bold opacity-25 text-center rotate-[-10deg]`}
				>
					Over Due
				</Animated.Text>
			)}
		</Card>
	);
};


export const StatusBadge = ({ status }: { status: CREDIT_STATUS }) => {
	const statusStyle = useMemo(() => {
		switch (status) {
			case CREDIT_STATUS.PAID:
				return {text: tw`text-success`, bg: tw`bg-success-light`};
			case CREDIT_STATUS.CANCELLED:
				return {text: tw`text-danger`, bg: tw`bg-danger-light`};
			default:
				return {text: tw`text-warning`, bg: tw`bg-warning-light`};
		}
	}, [status]);
	return (
		<View style={[tw`rounded-lg px-2 py-1`, statusStyle.bg]}>
			<Text style={[tw`text-sm`, statusStyle.text]}>{status ?? "Pending"}</Text>
		</View>
	);
};