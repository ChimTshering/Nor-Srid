import { customTheme } from "@/src/constants/constant";
import { ThemeProvider, useTheme } from "@rneui/themed";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
export default function RootLayout() {
  const { theme } = useTheme();
  const CreateDatabase = async(db:SQLiteDatabase)=>{
	// await db.execAsync(`
	// DROP TABLE IF EXISTS credits;
	// `);
	
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS credits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency TEXT NOT NULL,
      totalAmt REAL NOT NULL,
      dueAmt REAL NOT NULL,
      creditor TEXT NOT NULL,
      description TEXT NOT NULL,
      contactNo TEXT,
      dueDate TEXT,                  
      dueTime TEXT,                  
      cancelledDate TEXT,
      cancelledReason TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `); 
  }
  
  return (
		<SQLiteProvider
			databaseName={process.env.EXPO_PUBLIC_DB_NAME!}
			options={{ useNewConnection: false }}
			onInit={CreateDatabase}
		>
			<SafeAreaProvider>
				<SafeAreaView
					style={{
						flex: 1,
						backgroundColor: theme?.colors?.white,
					}}
				>
					<ThemeProvider theme={{ ...theme, ...customTheme }}>
						<KeyboardProvider>
							<Stack>
								<Stack.Screen options={{ headerShown: false }} name='index' />
								<Stack.Screen options={{ headerShown: false }} name='(tab)' />
							</Stack>
						</KeyboardProvider>
					</ThemeProvider>
				</SafeAreaView>
			</SafeAreaProvider>
		</SQLiteProvider>
	);
}
