import { Redirect, type Href } from 'expo-router';

export default function Index() {
    const signupHref = '/(auth)/Login' as Href;

    return <Redirect href={signupHref} />;
}