import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    schema?: any[];
    type?: 'website' | 'article';
    imageUrl?: string;
}

const baseUrl = 'https://smmmodular-5ce23f85d0ee.herokuapp.com'; // Wait, let me check the prompt for the original URL.
// The prompt has: URL: https://smmmodular-5ce23f85d0ee.herokuapp.com/

export const SEO = ({ title, description, canonical, schema = [], type = 'website', imageUrl }: SEOProps) => {
    const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
    const finalTitle = `${title} | SMM Modular Furniture`;
    const defaultImage = `${baseUrl}/images/SMM-Logo.png`;
    const finalImage = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`) : defaultImage;

    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SMM Modular Furniture",
        "url": baseUrl,
        "logo": defaultImage,
        "sameAs": []
    };

    const schemas = [baseSchema, ...schema];

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={fullCanonical} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={finalImage} />

            {/* JSON-LD Schemas */}
            {schemas.map((s, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};
