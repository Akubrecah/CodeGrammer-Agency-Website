
import { supabase } from './src/supabase-client.js';

const projects = [
    {
        title: 'Low Poly Base Mesh',
        category: 'Graphic Design',
        client: 'Lisa Chen',
        company: '3D Studio',
        duration: '10 Days',
        description: '<p>Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eu nibh elementum, accumsan ona neque ac, aliquet nunc.</p>',
        image_url: '/assets/images/projects/project-6.webp'
    },
    {
        title: 'Creative Agency',
        category: 'Web Design',
        client: 'Tech Corp',
        company: 'Agency Inc',
        duration: '2 Weeks',
        description: '<p>Creative Agency website design and development.</p>',
        image_url: '/assets/images/projects/project-2.webp'
    },
    {
        title: 'Art Deco Cocktails',
        category: 'UI/UX',
        client: 'Bar Co',
        company: 'Design Lab',
        duration: '1 Week',
        description: '<p>UI/UX Design for Art Deco Cocktails app.</p>',
        image_url: '/assets/images/projects/project-5.webp'
    },
    {
        title: 'Desktop Mockup',
        category: 'UI/UX',
        client: 'Mockup Masters',
        company: 'Design Lab',
        duration: '3 Days',
        description: '<p>High fidelity desktop mockup design.</p>',
        image_url: '/assets/images/projects/project-1.webp'
    },
    {
        title: 'Mobile Crypto Wallet',
        category: 'Software',
        client: 'Crypto Fintech',
        company: 'Dev Solutions',
        duration: '1 Month',
        description: '<p>Secure mobile crypto wallet application.</p>',
        image_url: '/assets/images/projects/project-3.webp'
    },
    {
        title: 'E-Shop Ecommerce',
        category: 'Developing',
        client: 'Shopify Clone',
        company: 'E-Com verify',
        duration: '2 Months',
        description: '<p>Full stack e-commerce platform.</p>',
        image_url: '/assets/images/projects/project-4.webp'
    }
];

const services = [
    {
        title: 'Web Design',
        description: '<p>Integer purus odio, placerat nec rhoncu in, ullamcorper nec dolor.</p>',
        image_url: '/assets/images/projects/project-2.webp'
    },
    {
        title: 'UI/UX Design',
        description: '<p>Integer purus odio, placerat nec rhoncu in, ullamcorper nec dolor.</p>',
        image_url: '/assets/images/projects/project-5.webp'
    },
    {
        title: 'Software Development',
        description: '<p>Integer purus odio, placerat nec rhoncu in, ullamcorper nec dolor.</p>',
        image_url: '/assets/images/projects/project-3.webp'
    }
];

async function migrate() {
    console.log('Starting Migration...');
    
    // Projects
    for (const p of projects) {
        const { data } = await supabase.from('company_projects').select('id').eq('title', p.title);
        if (!data || data.length === 0) {
            const { error } = await supabase.from('company_projects').insert(p);
            if(error) console.error(`Error inserting ${p.title}:`, error.message);
            else console.log(`Inserted Project: ${p.title}`);
        } else {
            console.log(`Project exists: ${p.title}`);
        }
    }

    // Services
    for (const s of services) {
        const { data } = await supabase.from('company_services').select('id').eq('title', s.title);
        if (!data || data.length === 0) {
            const { error } = await supabase.from('company_services').insert(s);
            if(error) console.error(`Error inserting ${s.title}:`, error.message);
            else console.log(`Inserted Service: ${s.title}`);
        } else {
            console.log(`Service exists: ${s.title}`);
        }
    }

    console.log('Migration Complete.');
}

migrate();
