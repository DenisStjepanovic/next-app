"use client";
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

const PersonOverview = () => {
    const [users, setUsers] = useState([]);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // Fetch group name
            const { data: groupData, error: groupError } = await supabase.from('groups').select('groupname').single();
            if (groupError) {
                console.error(groupError);
            } else {
                setGroupName(groupData.groupname);
            }

            // Fetch user data
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');
            const { data: transactionsData, error: transactionsError } = await supabase.from('userTransaction').select('*');

            if (usersError || transactionsError) {
                console.error(usersError || transactionsError);
            } else {
                const updatedUsers = usersData.map((user) => {
                    const userTransactions = transactionsData.filter((transaction) => transaction.userId === user.userId);
                    const totalAmount = userTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
                    return {
                        ...user,
                        amount: totalAmount,
                    };
                });
                setUsers(updatedUsers);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>{groupName}</h2>
            <h2>Overview</h2>
            <table className="table">
                <tbody>
                    {users.map((user) => (
                        <tr className="table-row" key={user.id}>
                            <td className="table-cell">{user.username}</td>
                            <td className={`table-cell ${user.amount >= 0 ? 'positive' : 'negative'}`}>
                                {user.amount.toFixed(2)} €
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <button className="add-user-button">Add User</button>
            </div>
        </div>
    );
};

export default PersonOverview;
