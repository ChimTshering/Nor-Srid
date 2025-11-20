import {
	BottomSheet,
	BottomSheetProps,
	Button,
	CheckBox,
	Divider,
	Input,
	Text,
} from "@rneui/themed";
import dayjs from "dayjs";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { showToastPromise } from "react-native-nitro-toast";
import { CREDIT_STATUS } from "../constants/constant";
import { Credit } from "../models/credit.model";
import { formatPhoneNumber } from "../utils/phone.util";
import tw from "../utils/tailwind";

interface CreditDetailModalProps extends BottomSheetProps {
	credit: Credit;
	onConfirm: () => void;
}

export const CreditDetailModal = (props: CreditDetailModalProps) => {
	const [payJustNow, setPayJustNow] = useState(false);

	const [payAmount, setPayAmount] = useState(0);

	const [cancelCredit, setCancelCredit] = useState(false);

	const [cancellationReason, setCancellationReason] = useState("");

	const dueAmt = useMemo(() => {
		return +(props.credit?.dueAmt ?? 0) - +payAmount;
	}, [props.credit?.dueAmt, payAmount]);

	const db = useSQLiteContext();

	const resetForm = useCallback(() => {
		setPayAmount(0);
		setCancellationReason("");
		setCancelCredit(false);
		setPayJustNow(false);
	}, []);

	const updateCredit = useCallback(async (): Promise<boolean> => {
		const getStatus = () => {
			if (cancelCredit && cancellationReason?.length > 0) {
				return CREDIT_STATUS.CANCELLED;
			}
			if (dueAmt === 0) {
				return CREDIT_STATUS.PAID;
			}
			return CREDIT_STATUS.PENDING;
		};
		try {
			const result = await db.runAsync(
				`UPDATE credits SET 
                dueAmt = ?, updatedAt = ?, cancelledDate = ?, cancelledReason = ?, status = ? WHERE id = ?`,
				[
					+(props.credit?.dueAmt ?? 0) - +payAmount,
					dayjs().toISOString(),
					cancellationReason?.length > 0 ? dayjs().toISOString() : null,
					cancellationReason,
					getStatus(),
					props.credit?.id!,
				]
			);
			resetForm();
			return result.changes > 0;
		} catch (error) {
			return Promise.resolve(false);
		} finally {
			props.onConfirm();
		}
	}, [payAmount, props.credit?.id]);

	const onConfirm = useCallback( () => {
		if (payJustNow) {
			showToastPromise(async () => await updateCredit(), {
				loading: "Updating credit...",
				success: 'Credit updated successfully',
				error: 'Oops! Error updating credit',
			},{
				duration: 3000,
				position: "top",
				loading:{title: "Updating credit..."},
			});
		} else {
			props.onConfirm();
		}
	}, [props.onConfirm, updateCredit, payAmount]);
	return (
		<BottomSheet {...props}>
			<View style={tw`bg-white rounded-t-2xl p-4 gap-y-2`}>
				<Text style={tw`text-2xl font-bold text-center`}>Credit Detail</Text>
				<Divider />
				<View style={tw`flex-row items-center justify-between`}>
					<View>
						<Text style={tw`text-lg font-bold text-slate`}>Due Amount</Text>
						<Text style={tw`text-lg font-bold text-slate`}>
							<Text style={tw`text-sm font-bold text-slate`}>
								{props.credit?.currency?.toUpperCase()} -{" "}
							</Text>{" "}
							{props.credit?.dueAmt?.toFixed(2)}
						</Text>
					</View>
					<View>
						<Text style={tw`text-lg text-slate`}>Original Amount</Text>
						<Text style={tw`text-lg text-slate`}>
							<Text style={tw`text-sm text-slate`}>
								{props.credit?.currency?.toUpperCase()} -{" "}
							</Text>{" "}
							{props.credit?.totalAmt?.toFixed(2)}
						</Text>
					</View>
				</View>
				<Divider />
				<Text style={tw`text-sm font-bold text-slate`}>Creditor</Text>
				<View style={tw`flex-row items-center justify-between`}>
					<Text style={tw`text-sm text-slate`}>
						Name : {props.credit?.creditor}
					</Text>
					<Text style={tw`text-sm text-slate`}>
						Contact : +975 {formatPhoneNumber(props.credit?.contactNo ?? "", "BT")}
					</Text>
				</View>
				<Divider />
				<View style={tw`flex-row items-center justify-between`}>
					<View>
						<Text style={tw`text-sm font-bold text-slate`}>Credited on</Text>
						<Text style={tw`text-sm text-slate`}>
							{dayjs(props.credit?.createdAt)?.format("MMM DD, YYYY")} |{" "}
							{dayjs(props.credit?.createdAt)?.format("hh:mm A")}
						</Text>
					</View>
					<View>
						<Text style={tw`text-sm font-bold text-slate`}>Due on</Text>
						<Text style={tw`text-sm text-slate`}>
							{dayjs(props.credit?.dueDate)?.format("MMM DD, YYYY")} |{" "}
							{dayjs(props.credit?.dueTime)?.format("hh:mm A")}
						</Text>
					</View>
				</View>
				<Divider />
				<View>
					<Text style={tw`text-sm font-bold text-slate`}>
						Last Updated on
					</Text>
					<Text style={tw`text-sm text-slate`}>
						{dayjs(props.credit?.updatedAt)?.format("MMM DD, YYYY")} |{" "}
						{dayjs(props.credit?.updatedAt)?.format("hh:mm A")}
					</Text>
				</View>
				<Divider />
				<View>
					<Text style={tw`text-sm font-bold text-slate`}>Credit Reason</Text>
					<Text style={tw`text-sm text-slate`}>
						{props.credit?.description ?? "N/A"}
					</Text>
				</View>
				<Divider />
				{props.credit?.status === CREDIT_STATUS.CANCELLED && (
					<>
					<View>
						<Text style={tw`text-sm font-bold text-slate`}>
							Cancellation Reason
						</Text>
						<Text style={tw`text-sm text-slate`}>
							{props.credit?.cancelledReason ?? "N/A"}
						</Text>
					</View>
				<Divider />
				</>
				)}

				<CheckBox
					checked={payJustNow}
					containerStyle={tw`bg-white`}
					onPress={() => {
						setPayJustNow(!payJustNow);
						setCancelCredit(false);
						setPayAmount(props.credit?.dueAmt ?? 0);
						setCancellationReason("");
					}}
					title='Update Credit ?'
				/>
				{payJustNow && (
					<View>
						<Input
							placeholder='Amount to pay'
							keyboardType='numeric'
							label='Amount to pay'
							value={payAmount?.toFixed(2)}
							onChangeText={(text) => setPayAmount(parseFloat(text))}
							rightIcon={<Text>Due : {dueAmt?.toFixed(2)}</Text>}
						/>
						{props.credit?.status !== CREDIT_STATUS.CANCELLED && (
							<>
								<CheckBox
									checked={cancelCredit}
									checkedIcon='dot-circle-o'
									uncheckedIcon='circle-o'
									containerStyle={tw`bg-white`}
									onPress={() => setCancelCredit(!cancelCredit)}
									title='Cancel credit ?'
								/>
								{cancelCredit && (
									<Input
										placeholder='Reason for cancellation'
										keyboardType='default'
										label='Reason *'
										multiline={true}
										value={cancellationReason}
										onChangeText={(text) => setCancellationReason(text)}
									/>
								)}
							</>
						)}
					</View>
				)}

				<View style={tw`flex-row items-center justify-between gap-x-4 mt-4`}>
					<View style={tw`flex-1`}>
						<Button
							title='Cancel'
							onPress={props.onBackdropPress}
							radius='sm'
							type='outline'
						/>
					</View>
					<View style={tw`flex-1`}>
						<Button
							title={"Okay"}
							disabled={
								payJustNow && cancelCredit && !cancellationReason?.length
							}
							onPress={onConfirm}
							radius='sm'
							disabledTitleStyle={tw`text-white`}
							disabledStyle={tw`opacity-60`}
						/>
					</View>
				</View>
			</View>
		</BottomSheet>
	);
};
