import React, {useState} from "react";
import {LockClosedIcon} from '@heroicons/react/20/solid'
import Head from "next/head";
import Image from "next/image";
import {trpc} from "../../utils/trpc";

const InstapaperLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const instapaperLogin = trpc.useMutation(['instapaper.login']);

    const loginInstapaper = (e: React.SyntheticEvent) => {
        e.preventDefault();
        instapaperLogin.mutate({username, password});
    }
    return (
        <>
            <Head>
                <title>Login to Instapaper</title>
                <meta name="description" content="Login to Instapaper"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={"min-h-screen flex"}>
                <div
                    className="m-auto max-w-m items-center justify-center py-12 px-4 pt-2 sm:px-6 lg:px-8">
                    <div className="w-full space-y-8">
                        <div className={"p-4 w-2/3 m-auto"}>
                            <Image
                                src="/instapaper-logo.png"
                                layout="responsive"
                                width={100}
                                height={100}
                                className={"object-top object-cover rounded-lg"}
                                alt={"Instapaper logo"}/>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Sign in to your Instapaper account
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={loginInstapaper}>
                        <input type="hidden" name="remember" defaultValue="true"/>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="instapaper-username"
                                    name="instapaper-username"
                                    type="text"
                                    autoComplete="instapaper-username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="instapaper-password"
                                    name="instapaper-password"
                                    type="password"
                                    autoComplete="instapaper-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                                        aria-hidden="true"/>
                                    </span>
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}


export default InstapaperLogin