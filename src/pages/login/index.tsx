import Link from "next/link";
import Image from "next/image";
import React from "react";

const Login = () => {
    return (
        <>
            <div className={"w-full mt-8 p-4 grid justify-center"}>
                <Link href={"/login/instapaper-login"} passHref={true}>
                    <a className={"hover:border p-4 rounded-lg"} target={"popup"}
                       onClick={() => window.open('/login/instapaper-login', 'instapaper-login-window', 'width=400,height=700')}>
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
                    </a>
                </Link>
            </div>
        </>
    )
}

export default Login