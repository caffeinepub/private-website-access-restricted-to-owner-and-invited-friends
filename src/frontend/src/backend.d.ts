import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    emoji: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAllowlistEntry(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllowlist(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(adminToken: string, userProvidedToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeAllowlistEntry(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
