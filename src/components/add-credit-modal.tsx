import { BottomSheet, BottomSheetProps, Button, Divider, Input } from "@rneui/themed";
import dayJs from "dayjs";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { CREDIT_STATUS } from "../constants/constant";
import { Credit } from "../models/credit.model";
import { formatPhoneNumber, validatePhoneNumber } from "../utils/phone.util";
import tw from "../utils/tailwind";
import { DatePickerInput } from "./datePicker";

interface CreateCreditModalProps extends BottomSheetProps {
	onSubmit: (data: Credit) => void;
}

export const CreateCreditModal = (props: CreateCreditModalProps) => {
	const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<Credit>({
		defaultValues: {
			currency: "BTN",
			dueDate: dayJs().add(1, "week").toISOString(),
			dueTime: dayJs().toISOString(),
			status: CREDIT_STATUS.PENDING,
			createdAt: dayJs().toISOString(),
			updatedAt: dayJs().toISOString(),
		},
	});

	const onSubmit = useCallback(
		(data: Credit) => {
			props.onSubmit(data);
			reset();
		},
		[props.onSubmit, reset]
	);

	return (
		<BottomSheet {...props}>
			<View style={tw`bg-white rounded-t-2xl p-4`}>
				<Text style={tw`text-2xl font-bold mb-2`}>Create Credit</Text>
				<KeyboardAwareScrollView contentContainerStyle={tw`flex-1`}>
					<View style={tw`flex-row items-center w-full gap-x-1`}>
						<View style={tw`w-2/5`}>
							<Controller
								control={control}
								name='currency'
								rules={{ required: "Currency is required" }}
								render={({ field, fieldState: { error } }) => (
									<Input
										style={tw`p-2 ${error ? "border-danger" : ""}`}
										placeholder='Currency*'
										inputStyle={tw`text-slate mt-3 ${
											!!field?.value ? "-mt-2" : ""
										}`}
										autoCapitalize='characters'
										label={!!field?.value && "Currency*"}
										keyboardType='default'
										errorMessage={error?.message}
										value={field.value?.toString()}
										onChangeText={field.onChange}
									/>
								)}
							/>
						</View>
						<View style={tw`w-3/5`}>
							<Controller
								control={control}
								name='totalAmt'
								rules={{ required: "Amount is required" }}
								render={({ field, fieldState: { error } }) => (
									<Input
										style={tw`p-2 ${error ? "border-danger" : ""}`}
										placeholder='Amount*'
										inputStyle={tw`text-slate mt-3 ${
											!!field?.value ? "-mt-2" : ""
										}`}
										label={!!field?.value && "Amount*"}
										keyboardType='numeric'
										errorMessage={error?.message}
										value={field.value?.toString()}
										onChangeText={field.onChange}
									/>
								)}
							/>
						</View>
					</View>
					<Controller
						control={control}
						name='description'
						rules={{
							required: "Description is required",
							maxLength: {
								value: 100,
								message: "Description must be less than 100 characters",
							},
						}}
						render={({ field, fieldState: { error } }) => (
							<Input
								style={tw`p-2 ${error ? "border-danger" : ""}`}
								// multiline={true}
								maxLength={100}
								placeholder='Credit Reason*'
								inputStyle={tw`text-slate ${!!field?.value ? "-mt-2" : ""}`}
								label={!!field?.value?.length && "Reason*"}
								errorMessage={error?.message}
								value={field.value}
								rightIcon={
									<Text style={tw`text-sm text-mist-gray`}>
										{field.value?.length ?? 0}/100
									</Text>
								}
								onChangeText={field.onChange}
							/>
						)}
					/>
					<Divider />
					<Text style={tw`text-lg font-bold my-2`}>Creditor</Text>
					<Controller
						control={control}
						name='creditor'
						rules={{ required: "Creditor is required" }}
						render={({ field, fieldState: { error } }) => (
							<Input
								style={tw`p-2 ${error ? "border-danger" : ""}`}
								placeholder='Name*'
								inputStyle={tw`text-slate ${!!field?.value ? "-mt-2" : ""}`}
								label={!!field?.value?.length && "Name*"}
								errorMessage={error?.message}
								value={field.value}
								onChangeText={field.onChange}
							/>
						)}
					/>
					<Controller
						control={control}
						name='contactNo'
						rules={{ validate: (value) =>value ? validatePhoneNumber(value) : undefined }}
						render={({ field, fieldState: { error } }) => (
							<Input
								style={tw`p-2 ${error ? "border-danger" : ""}`}
								keyboardType='numeric'
								placeholder='Contact Number'
								leftIcon={<Text style={tw`text-slate text-base`}>+975</Text>}
								leftIconContainerStyle={tw`text-slate ${
									!!field?.value ? "-mt-2" : ""
								}`}
								inputStyle={tw`text-slate ${!!field?.value ? "-mt-2" : ""}`}
								label={!!field?.value && "Contact Number"}
								errorMessage={error?.message}
								value={formatPhoneNumber(field.value ?? "", "BT")}
								onChangeText={field.onChange}
							/>
						)}
					/>

					<Divider />
					<View style={tw`flex-row w-full gap-x-4 mt-2`}>
						<View style={tw`flex-1`}>
							<Controller
								control={control}
								name='dueDate'
								rules={{ required: "Date is required" }}
								render={({ field, formState: { errors } }) => (
									<DatePickerInput
										title='Due Date*'
										mode='date'
										style={tw`p-2 ${errors?.dueDate ? "border-danger" : ""}`}
										date={dayJs(field.value)?.toDate()}
										onConfirm={(date: Date) => {
											field.onChange(date?.toISOString?.());
										}}
									/>
								)}
							/>
						</View>
						<View style={tw`flex-1`}>
							<Controller
								control={control}
								name='dueTime'
								rules={{ required: "Time is required" }}
								render={({ field, fieldState: { error } }) => (
									<DatePickerInput
										title='Due Time*'
										mode='time'
										style={tw`p-2 ${error ? "border-danger" : ""}`}
										date={dayJs(field.value)?.toDate()}
										onConfirm={(date: Date) => {
											field.onChange(date?.toISOString?.());
										}}
									/>
								)}
							/>
						</View>
					</View>

					<View style={tw`flex-row gap-x-4`}>
						<View style={tw`flex-1`}>
							<Button
								title='Cancel'
								onPress={props.onBackdropPress}
								type='outline'
								radius={"sm"}
							/>
						</View>
						<View style={tw`flex-1`}>
							<Button
								title='Create'
								disabled={!isValid}
								disabledTitleStyle={tw`text-white`}
								disabledStyle={tw`opacity-60 bg-primary`}
								onPress={handleSubmit(onSubmit)}
								radius={"sm"}
							/>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		</BottomSheet>
	);
};
