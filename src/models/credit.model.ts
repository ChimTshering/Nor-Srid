import { CREDIT_STATUS } from "../constants/constant";

export interface Credit {
    id?: number;
    currency: string;
    totalAmt: number;
    dueAmt: number;
    creditor: string;
    contactNo?: string;
    description: string;
    dueDate: string;
    dueTime: string;
    cancelledDate?: string;
    cancelledReason?: string;
    status: CREDIT_STATUS;
    createdAt: string;
    updatedAt: string;
}