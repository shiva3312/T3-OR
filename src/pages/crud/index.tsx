import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { api } from "~/utils/api";

export default function Home() {
    return (
        <>
            <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center px-4 py-16 ">
                    <h1 className="font-extrabold tracking-tight text-white sm:text-[2rem] ">
                        CRUD
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <AuthShowcase />
                    </div>
                </div>
                <div className="flex justify-center align-center">
                    <Link href="/">
                        <button className="rounded text-xs bg-white/10 px-5 py-2 mx-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        >
                            Home Page
                        </button>
                    </Link>
                </div>
            </main>
        </>
    );
}

function AuthShowcase() {
    const { data: sessionData } = useSession();
    const router = useRouter();
    const { data: secretMessage } = api.post.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    useEffect(() => {
        // If not authenticated, redirect to the root/login page
        const redirectToLogin = async () => {
            if (!sessionData?.user) {
                try {
                    await router.push('/');
                } catch (error) {
                    console.error('Error while redirecting to login:', error);
                }
            }
        };
        void redirectToLogin();
    }, [router, sessionData?.user])

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-xs text-white">
                {sessionData ? <span>Logged in as {sessionData.user?.username}</span> : <span>Please login.</span>}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
        </div>
    );
}
