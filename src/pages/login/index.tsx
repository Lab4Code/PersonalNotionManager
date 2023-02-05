import Link from "next/link";
import Image from "next/image";
import React from "react";
import { api } from "../../utils/api";

const Login = () => {
  return (
    <>
      <div className={"mt-8 grid w-full justify-center p-4"}>
        <InstapaperLogin />
        <NotionLogin />
      </div>
    </>
  );
};

const InstapaperLogin = () => {
  // const data = trpc.useQuery(['instapaper.isLoggedIn']);
  return (
    <>
      <Link
        href={"/login/instapaper-login"}
        className={"rounded-lg p-4 hover:border"}
        onClick={(e) => {
          e.preventDefault();
          window.open(
            "/login/instapaper-login",
            "instapaper-login-window",
            "width=400,height=700"
          );
        }}
      >
        <div className={"h-32 w-32"}>
          <Image
            src="/instapaper-logo.png"
            layout="responsive"
            width={100}
            height={100}
            className={"rounded-lg object-cover object-top"}
            alt={"Instapaper logo"}
          />
        </div>
        <h3 className={"text-center font-semibold"}>Instapaper</h3>
      </Link>
    </>
  );
};

const NotionLogin = () => {
  const { data, isLoading } = api.notion.login.useQuery();
  console.log(data);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {data.map((item: any) => {
        return (
          <div key={item.id} className={"flex gap-2.5"}>
            <span>{item.properties.Name.title[0].plain_text}</span>
            <span>{item.properties.Date.date.start}</span>
          </div>
        );
      })}
    </>
  );
};
export default Login;
