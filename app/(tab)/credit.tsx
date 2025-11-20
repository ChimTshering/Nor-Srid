import { CreateCreditModal } from "@/src/components/add-credit-modal";
import { CreditCard } from "@/src/components/credit-card";
import { CreditDetailModal } from "@/src/components/credit-detail-modal";
import { DeleteModal } from "@/src/components/delete-modal";
import { Credit } from "@/src/models/credit.model";
import { FAB, Tab, TabView, useTheme } from "@rneui/themed";
import { useSQLiteContext } from "expo-sqlite";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { showToastPromise } from "react-native-nitro-toast";
import tw from "../../src/utils/tailwind";

const CreditTabStatus = ["all", "pending", "paid", "cancelled"];
export default function CreditScreen() {
	const [showModal, setShowModal] = useState(false);

	const [showDetailModal, setShowDetailModal] = useState(false);

	const [credits, setCredits] = useState<Credit[]>([]);

	const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);

	const [selectedTab, setSelectedTab] = useState<number>(1);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const { theme } = useTheme();

	const db = useSQLiteContext();

	const getCredits = useCallback(async () => {
		try {
			const credits: Credit[] = await db.getAllAsync<Credit>(
				`SELECT * FROM credits ${selectedTab === 0 ? "" : "WHERE status = ?"} ORDER BY id DESC`,
				[CreditTabStatus[selectedTab]]
			);
			setCredits(credits);
		} catch (error) {
			console.log("error getting credits", error);
		}
	}, [selectedTab, db]);

	const addCredit = useCallback(async (formData: Credit): Promise<string> => {
		try {
			await db.runAsync(
				`INSERT INTO credits 
				(totalAmt, currency, dueAmt, creditor, contactNo, description, dueDate, dueTime, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					formData.totalAmt,
					formData.currency,
					formData.totalAmt,
					formData.creditor,
					formData.contactNo ?? null,
					formData.description,
					formData.dueDate,
					formData.dueTime,
					formData.status,
					formData.createdAt,
					formData.updatedAt,
				]
			);
			setShowModal(false);
			await getCredits();
			return Promise.resolve("Credit added successfully");
		} catch (error) {
			console.log("error adding credit", error);
			return Promise.reject(new Error("Oops! Error adding credit"));
		}
	}, []);

	const onSubmit = useCallback((data: Credit) => {
		showToastPromise(addCredit(data), {
			loading: "Adding credit...",
			success: result => result,
			error: error => error,
		},{
			duration: 3000,
			position: "top",
			loading:{title: "Adding credit..."},
		});
		
	}, [addCredit]);

	const handlePress = useCallback((credit: Credit) => {
		setSelectedCredit(credit);
		setShowDetailModal(true);
	}, []);
	
	const handleLongPress = useCallback((credit: Credit) => {
		setSelectedCredit(credit);
		setShowDeleteModal(true);
	}, []);


	const handleDelete = useCallback(async () => {
		if(!selectedCredit) return;
		showToastPromise(async () => {
			await db.runAsync(`DELETE FROM credits WHERE id = ?`, [selectedCredit?.id!]);
			await getCredits();
			setShowDeleteModal(false);
		}, {
			loading: "Deleting credit...",
			success: "Credit deleted successfully",
			error: "Oops! Error deleting credit",
		}, {
			duration: 3000,
			position: "top",
			loading:{title: "Deleting credit..."},
		});
	}, [getCredits, selectedCredit?.id]);
	
	
		useEffect(() => {
			async function fetchCredits() {
				await getCredits();
			}
			fetchCredits();
		}, [getCredits, selectedTab]);
	return (
		<View style={tw`flex-1 bg-white`}>
			<View style={tw`flex-row items-center justify-between p-4`}>
				<Text style={tw`text-2xl font-bold`}> Credit List</Text>
				<Text style={tw`text-sm text-slate`}> Total: {credits?.length}</Text>
			</View>
			<View style={tw`flex-1`}>
				<Tab
					value={selectedTab}
					disableIndicator
					onChange={(index) => setSelectedTab(index)}
					indicatorStyle={tw``}
					containerStyle={tw`pt-2`}
				>
					<Tab.Item
						title='All'
						titleStyle={(active) => tw`p-0 ${active ? "text-lg" : "text-base"}`}
						containerStyle={(active) =>
							tw`rounded-tr-lg ${active ? "bg-porcelain" : "bg-white"} `
						}
					/>
					<Tab.Item
						title='Pending'
						titleStyle={(active) => tw`p-0 ${active ? "text-lg" : "text-base"}`}
						containerStyle={(active) =>
							tw`rounded-t-lg ${active ? "bg-porcelain" : "bg-white"} `
						}
					/>
					<Tab.Item
						title='Paid'
						titleStyle={(active) => tw`p-0 ${active ? "text-lg" : "text-base"}`}
						containerStyle={(active) =>
							tw`rounded-t-lg ${active ? "bg-porcelain" : "bg-white"} `
						}
					/>
					<Tab.Item
						title='Cancelled'
						titleStyle={(active) => tw`p-0 ${active ? "text-lg" : "text-base"}`}
						containerStyle={(active) =>
							tw`rounded-tl-lg ${active ? "bg-porcelain" : "bg-white"} `
						}
					/>
				</Tab>
				{credits?.length ? (
					<TabView
						containerStyle={tw`flex-1 bg-porcelain`}
						value={selectedTab}
						onChange={(index) => setSelectedTab(index)}
						animationType='spring'
					>
						{[0, 1, 2, 3].map((item) => {
							return (
								<TabView.Item key={item} style={tw`flex-1`}>
									<ScrollView style={tw`flex-1`}>
										{credits?.map((item) => {
											return (
												<CreditCard
													key={item?.id}
													credit={item}
													onPress={() => handlePress(item)}
													onLongPress={() => handleLongPress(item)}
												/>
											);
										})}
									</ScrollView>
								</TabView.Item>
							);
						})}
					</TabView>
				) : (
					<View style={tw`flex-1 items-center justify-center bg-porcelain`}>
						<LottieView
							source={require("@/assets/empty.json")}
							style={tw`w-full h-2/3`}
							autoPlay
							loop
						/>
						<Text style={tw`text-center text-2xl font-bold text-navy`}>
							No Credits Found
						</Text>
					</View>
				)}
			</View>
			<FAB
				icon={{ name: "add", color: "white" }}
				style={tw`bottom-10 right-10 absolute`}
				onPress={() => setShowModal(true)}
				color={theme?.colors?.primary}
			/>
			<CreateCreditModal
				isVisible={showModal}
				onBackdropPress={() => setShowModal(false)}
				onSubmit={onSubmit}
			/>
			<CreditDetailModal
				isVisible={showDetailModal}
				onConfirm={async () => {
					await getCredits();
					setShowDetailModal(false);
				}}
				onBackdropPress={() => setShowDetailModal(false)}
				credit={selectedCredit!}
			/>
			<DeleteModal 
			isVisible={showDeleteModal}
			onConfirm={handleDelete}
			onBackdropPress={() => setShowDeleteModal(false)}
			credit={selectedCredit!}
			/>
		</View>
	);
}
