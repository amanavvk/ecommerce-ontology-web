import Link from 'next/link';

const Navigation = () => {
    return (
        <nav className="nav">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Semantic Web Case Studies
                    </h1>
                    <ul className="nav-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/ontology">E-Commerce Ontology</Link></li>
                        <li><Link href="/queries">E-Commerce Queries</Link></li>
                        <li><Link href="/validation">E-Commerce Validation</Link></li>
                        <li><Link href="/manufacturing">Manufacturing R2RML</Link></li>
                        <li><Link href="/manufacturing/queries">Manufacturing Queries</Link></li>
                        <li><Link href="/data-upload">R2RML Data Upload</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;