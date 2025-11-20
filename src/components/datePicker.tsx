import { Input } from "@rneui/themed";
import dayJs from "dayjs";
import { useState } from "react";
import { Pressable } from "react-native";
import DatePicker, { DatePickerProps } from "react-native-date-picker";

interface DatePickerInputProps extends Omit<DatePickerProps, "open"> {
    title: string;
}

export const DatePickerInput = (props: DatePickerInputProps) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Pressable onPress={() => setOpen(true)}>
				<Input
					label={props?.title}
					value={props?.mode === "date" ? dayJs(props?.date)?.format("DD MMM, YYYY") : dayJs(props?.date)?.format("HH:mm A")}
					readOnly
				/>
			</Pressable>
			<DatePicker
				modal
				mode='date'
				open={open}
				{...props}
				onConfirm={(date: Date) => {
					props.onConfirm?.(date);
					setOpen(false);
				}}
				onCancel={() => {
					props.onCancel?.();
					setOpen(false);
				}}
			/>
		</>
	);
};
