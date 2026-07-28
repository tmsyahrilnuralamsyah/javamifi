import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function useMidtransSnap() {
    const { midtrans } = usePage().props;
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!midtrans?.client_key || !midtrans?.snap_script_url) {
            return undefined;
        }

        const existingScript = document.querySelector('script[data-midtrans-snap="true"]');

        if (existingScript) {
            if (window.snap) {
                setReady(true);
                return undefined;
            }

            const handleLoad = () => setReady(true);
            existingScript.addEventListener('load', handleLoad);

            return () => {
                existingScript.removeEventListener('load', handleLoad);
            };
        }

        const script = document.createElement('script');
        script.src = midtrans.snap_script_url;
        script.setAttribute('data-client-key', midtrans.client_key);
        script.setAttribute('data-midtrans-snap', 'true');
        script.async = true;
        script.onload = () => setReady(true);

        document.body.appendChild(script);

        return () => {
            script.onload = null;
        };
    }, [midtrans?.client_key, midtrans?.snap_script_url]);

    return ready && window.snap ? window.snap : null;
}
