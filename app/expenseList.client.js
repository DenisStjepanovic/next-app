"use client";
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const { data: transactionsData, error: transactionsError } = await supabase.from('transactions').select('*');
            const { data: groupsData, error: groupsError } = await supabase.from('groups').select('*');
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');

            if (transactionsError || groupsError || usersError) {
                console.error(transactionsError || groupsError || usersError);
            } else {
                const updatedExpenses = transactionsData.map((transactions) => {
                    const groups = groupsData.find((groups) => groups.groupId === transactions.groupId);
                    const users = usersData.find((users) => users.userId === transactions.payedBy);

                    return {
                        id: transactions.transactionId,
                        title: transactions ? transactions.title : '',
                        username: users ? users.username : '',
                        amount: transactions.total,
                    };
                });

                setExpenses(updatedExpenses);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div>
            <h2>Expenses</h2>
            <table className="table">
                <tbody>
                    {expenses.map((expense) => (
                        <tr className="table-row" key={expense.id}>
                            <td className="table-cell">
                                <Link href={`/expenses/${expense.id}`}>
                                    <strong><u>{expense.title}</u></strong><br />{expense.username}
                                </Link>
                            </td>
                            <td className="table-cell-expenses">
                                {expense.amount.toFixed(2)} €
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-container">
                <a href="/expenseform"><button className="add-user-button">New expense</button></a>
            </div>
        </div>
    );
};

export default ExpenseList;
