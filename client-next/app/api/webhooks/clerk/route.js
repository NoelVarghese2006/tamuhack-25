import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const webhook = new Webhook(SIGNING_SECRET);

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
        status: 400,
        });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    let event;

    try {
        event = webhook.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
        status: 400,
        });
    }

    if (event.type === 'user.created') {
        const origin = process.env.NEXT_PUBLIC_SITE_URL || (request.nextUrl ? request.nextUrl.origin : new URL(request.url).origin);
        const url = `${origin}/api/users`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId: event.data.id,
                    first_name: event.data.first_name,
                    last_name: event.data.last_name,
                    email: event.data.email,
                }),
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }

    return new Response('Webhook received', { status: 200 });
}
