import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

interface Lead {
    _id: string;
    name: string;
    email: string;
    status: string;
    source: string;
    createdAt: string;
}

const LeadDetails = () => {
    const { id } = useParams();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await api.get(`/leads/${id}`);
                setLead(response.data.data);
            } catch (error) {
                console.error('Failed to fetch lead');
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 text-white">
                Loading lead details...
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="p-6 text-red-500">
                Lead not found
            </div>
        );
    }

    return (
        <div className="p-6">
            <Link
                to="/leads"
                className="text-blue-500 hover:underline"
            >
                ← Back to Leads
            </Link>

            <div className="mt-6 bg-[#111827] border border-slate-800 rounded-2xl p-6 text-white max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">
                    Lead Details
                </h1>

                <div className="space-y-4">
                    <div>
                        <p className="text-slate-400 text-sm">Name</p>
                        <p className="text-lg font-semibold">{lead.name}</p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm">Email</p>
                        <p>{lead.email}</p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm">Status</p>
                        <p>{lead.status}</p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm">Source</p>
                        <p>{lead.source}</p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-sm">Created At</p>
                        <p>
                            {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetails;