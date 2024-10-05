import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentsPage: React.FC = () => {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('/api/documents');
                setCards(response.data);
            } catch (error) {
                console.error('Error fetching docs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 3, padding: '20px' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : cards.length === 0 ? (
                    <button onClick={() => alert('Import a document')}>Import a Document</button>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {cards.map((card, index) => (
                            <div key={index} style={{ border: '1px solid #ccc', padding: '20px' }}>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #ccc', padding: '20px' }}>
                <h2>File Explorer</h2>
                {/* File explorer content goes here */}
            </div>
        </div>
    );
};

export default DocumentsPage;