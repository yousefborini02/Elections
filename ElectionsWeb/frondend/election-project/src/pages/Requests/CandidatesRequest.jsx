import axios from 'axios';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../../layouts/navbar';

function FetchUserByN_Id() {
    const [N_Id, setN_Id] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState({});
    const location = useLocation();
    const { listId } = location.state || {};
    const { circle } = location.state || {};

    const fetchUser = async (N_Id) => {
        if (!N_Id) {
            setError('يرجى إدخال الرقم الوطني.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (users.length >= 10) {
                setError('لا يمكن إضافة أكثر من 10 مرشحين.');
                return;
            }
console.log(N_Id);
            const response = await axios.get(`http://localhost:3001/api/users/${N_Id}`);
            const newUser = response.data;
            setUsers(prevUsers => {
                return [...prevUsers.filter(user => user.N_Id !== N_Id), newUser];
            });
            setCurrentUserId(N_Id);
        } catch (error) {
            Swal.fire('خطأ', 'حدث خطأ أثناء جلب البيانات.', 'error');
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetch = () => {
        fetchUser(N_Id);
    };

    const handleAddCandidate = async (user) => {
        if (users.length >= 10) {
            setError('لا يمكن إضافة أكثر من 10 مرشحين.');
            Swal.fire('خطأ', 'لا يمكن إضافة أكثر من 10 مرشحين.', 'error');
            return;
        }

        const { value: isConfirmed } = await Swal.fire({
            title: 'تأكيد',
            text: 'هل أنت متأكد من إضافة هذا المرشح؟',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم',
            cancelButtonText: 'لا',
        });

        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/api/candidates', {
                N_Id: user.N_Id,
                candidate_name: "dd",
                local_list_id: listId,
                circle_id: circle
            });

            if (response && response.data) {
                console.log(response.data);
                setUsers(users.filter(u => u.N_Id !== user.N_Id));
                Swal.fire('نجاح', 'تمت إضافة المرشح بنجاح!', 'success');
            } else {
                throw new Error('استجابة غير متوقعة من الخادم');
            }
        } catch (error) {
            console.error('Error adding candidate:', error);
            const errorMessage = error.response?.data?.error || 'حدث خطأ أثناء إضافة المرشح.';
            setError(errorMessage);
            Swal.fire('خطأ', errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleDetails = (userId) => {
        setShowDetails(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center p-6 bg-white shadow-2xl rounded-lg mt-20 mx-auto w-full max-w-4xl">
                <h4 className="text-3xl font-bold mb-4 text-green-800">طلب إضافة مرشحين </h4>

                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <input
                        type="text"
                        value={N_Id}
                        onChange={(e) => setN_Id(e.target.value)}
                        placeholder="أدخل الرقم الوطني"
                        className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <button 
                        onClick={handleFetch} 
                        className={`w-full px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : 'استعلام'}
                    </button>
                    {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
                </div>

                {users.length > 0 && (
                    <div className="w-full max-w-2xl mt-6 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-green-800">قائمة المرشحين </h2>
                        {users.map(user => (
                            <div key={user.N_Id} className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-semibold text-gray-800">{user.name}</span>
                                    <div>
                                        <button 
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md ml-5 hover:bg-yellow-700"
                                            onClick={() => toggleDetails(user.N_Id)}
                                        >
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d={showDetails[user.N_Id] ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            {showDetails[user.N_Id] ? 'إخفاء التفاصيل' : 'إظهار التفاصيل'}
                                        </button>
                                        <button 
                                            className="bg-green-600 text-white px-3 py-1 rounded-md"
                                            onClick={() => handleAddCandidate(user)}
                                        > 
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 13H5m7-7v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            إضافة كمرشح
                                        </button>
                                    </div>
                                </div>
                                {showDetails[user.N_Id] && (
                                    <div className="bg-gray-100 p-4 rounded-md">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">الاسم:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.name}</p>
                                            </div>
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">البريد الإلكتروني:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">الجنس:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.gender}</p>
                                            </div>
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">العمر:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.age}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">المدينة:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.city}</p>
                                            </div>
                                            <div>
                                                <strong className="block text-sm font-medium text-gray-700">الديانة:</strong>
                                                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-white">{user.religion}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FetchUserByN_Id;