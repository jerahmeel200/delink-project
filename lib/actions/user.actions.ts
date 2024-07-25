"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_BUCKET_ID: BUCKET_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, email }: SignUpParams) => {
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password);

    if (!newUserAccount) throw new Error("Error creating user");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        userId: newUserAccount.$id,
        email,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
};

export const getLoggedInUser = async (): Promise<User | null> => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return user ? (user as User) : null; // Ensure the returned value is of type User
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async ($id: string, profileData: any) => {
  try {
    const { database } = await createAdminClient();

    console.log(`Updating profile for user ID: ${$id}`);

    const user = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      $id,
      profileData
    );

    return parseStringify(user);
  } catch (error) {
    console.error("Error updating user profile", error);
    return null;
  }
};

export const addLinksToUser = async (
  $id: string,
  links: { platform: string; link: string }[]
) => {
  try {
    const { database } = await createAdminClient();

    // Prepare the data to update
    const data: { [key: string]: string } = {};
    links.forEach(({ platform, link }) => {
      data[platform] = link;
    });

    console.log(`Uploading links for user ID: ${$id}`);
    const user = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      $id,
      data
    );
    return user; // No need for parseStringify if not needed
  } catch (error) {
    console.error("Error updating user links:", error);
    throw error;
  }
};
