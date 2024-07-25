/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  userId: string;
  profilePicture?: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  $id: string;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  password: string;
};

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}

declare interface SiderbarProps {
  user: User;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface PhoneProps {
  user: {
    $id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    facebook?: string | null;
    instagram?: string | null;
  } | null;
}
