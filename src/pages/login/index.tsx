import Link from "next/link";
import Image from "next/image";
import React from "react";
import {trpc} from "../../utils/trpc";

const Login = () => {
    return (
        <>
            <div className={"w-full mt-8 p-4 grid justify-center"}>
                <InstapaperLogin/>
                <NotionLogin/>
            </div>
        </>
    )
}

const InstapaperLogin = () => {
    // const data = trpc.useQuery(['instapaper.isLoggedIn']);
    return (
        <>
            <Link href={"/login/instapaper-login"} className={"hover:border p-4 rounded-lg"}
                  onClick={(e) => {
                      e.preventDefault()
                      window.open('/login/instapaper-login', 'instapaper-login-window', 'width=400,height=700')
                  }}>
                <div className={"h-32 w-32"}>
                    <Image
                        src="/instapaper-logo.png"
                        layout="responsive"
                        width={100}
                        height={100}
                        className={"object-top object-cover rounded-lg"}
                        alt={"Instapaper logo"}/>
                </div>
                <h3 className={"text-center font-semibold"}>Instapaper</h3>
            </Link>
        </>
    )
}

const NotionLogin = () => {
    const {data, isLoading} = trpc.notion.login.useQuery();
    console.log(data)
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <>
            {data.map((item: any) => {
                return (
                    <div key={item.id} className={"flex gap-2.5"}>
                        <span>{item.properties.Name.title[0].plain_text}</span>
                        <span>{item.properties.Date.date.start}</span>
                    </div>
                )
            })}
        </>
    );
}
export default Login