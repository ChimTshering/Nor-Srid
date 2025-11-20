import { createTheme } from "@rneui/themed";
import * as colors from "../utils/colors";
export const customTheme = createTheme({
    lightColors: colors,
    darkColors: colors,
})

export enum STORAGE_KEYS { 
    FACE_ID='face_id',
    CREDITS='credits',
}

export enum CREDIT_STATUS {
    PENDING='pending',
    PAID='paid',
    CANCELLED='cancelled',
}