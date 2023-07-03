"use client";
import { useEffect, useState } from 'react';
import supabase from '../../../lib/supabaseClient';

export default function ExpensePage({ params }) {
    const [groupName, setGroupName] = useState('');
    const [title, setTitle] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [users, setUsers] = useState([]);
    const [payedByUser, setpayedByUser] = useState('');
    const [positiveAmounts, setPositiveAmounts] = useState([]);

    useEffect(() => {
        const fetchExpenseDetails = async () => {
            // Fetch group name
            const { data: groupData, error: groupError } = await supabase.from('groups').select('groupname').single();
            if (groupError) {
                console.error(groupError);
            } else {
                setGroupName(groupData.groupname);
            }

            const { data: expenseData, error: expenseError } = await supabase
                .from('transactions')
                .select('*')
                .eq('transactionId', params.id)
                .single();
            if (expenseError) {
                console.error(expenseError);
            } else {
                setTitle(expenseData.title);
                setCreatedAt(expenseData.createdAt);
            }

            // Fetch user data
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('userTransaction')
                .select('*')
                .eq('transactionId', params.id);

            if (usersError || transactionsError) {
                console.error(usersError || transactionsError);
            } else {
                const updatedUsers = usersData.map((user) => {
                    const userTransactions = transactionsData.filter(
                        (transaction) => transaction.userId === user.userId && transaction.amount < 0
                    );
                    const totalAmount = userTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
                    return {
                        ...user,
                        amount: totalAmount,
                    };
                });
                setUsers(updatedUsers);
            }
            const payedById = expenseData.payedBy;
            const { data: payedByNameData, error: payedByNameError } = await supabase
                .from('users')
                .select('username')
                .eq('userId', payedById)
                .single();
            if (payedByNameError) {
                console.error(payedByNameError);
            } else {
                setpayedByUser(payedByNameData.username);
            }
            // Fetch positive amounts data
            const { data: positveTransactionsData, error: poitiveTransactionsError } = await supabase
                .from('userTransaction')
                .select('*')
                .eq('transactionId', params.id)
                .gt('amount', 0);

            if (poitiveTransactionsError) {
                console.error(poitiveTransactionsError);
            } else {
                setPositiveAmounts(positveTransactionsData);
            }
        };
        fetchExpenseDetails();
    }, []);

    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}. ${month} ${year}, ${hours}:${minutes}`;
    };
    const formattedCreatedAt = createdAt ? formatCreatedAt(createdAt) : '';

    return (
        <div className="container">
            <div className="container-table">
                <h2>{groupName}</h2>
                <h3>{title}</h3>
                <p>{formattedCreatedAt}</p>
                <table className="table">
                    <tbody>
                        {users.filter(user => user.amount !== 0).map((user) => (
                            <tr className="table-row" key={user.id}>
                                <td className="table-cell">{user.username}</td>
                                <td className={`table-cell ${user.amount >= 0 ? 'positive' : 'negative'}`}>
                                    {user.amount.toFixed(2)} €
                                </td>
                            </tr>
                        ))}
                        <tr className="table-row-end">
                            <td className="table-cell">{payedByUser}</td>
                            {positiveAmounts.map((transaction) => (
                                <td className="table-cell positive">{transaction.amount.toFixed(2)} €</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <div className="button-container">
                    <a href="/"><button className="add-user-button">Back</button></a>
                </div>
            </div>
        </div>
    );
}
